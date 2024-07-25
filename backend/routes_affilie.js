const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { RendezVous } = require('./pojo/RendezVous');
const { fetchAgence, fetchService, fetchCountries, fetchCities } = require('./dao/AgenceDao');
const affilieGestion = require('./gestion/AffilieGestion');
const rendezVousGestion = require('./gestion/RendezVousGestion');


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Aucun token fourni' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Format de token invalide' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.numero_identite = decoded.numero_identite;
        req.numero_matricule = decoded.numero_matricule;
        req.id_affilie = decoded.id_affilie;

        const affilie = await affilieGestion.fetchAffilie(req.numero_identite, true);
        if (!affilie) {
            return res.status(404).json({ message: 'Affilié non trouvé. Impossible de créer un rendez-vous.' });
        }

        const isMatriculeValid = await bcrypt.compare(req.numero_matricule, affilie.numero_matricule);
        if (!isMatriculeValid) {
            return res.status(401).json({ message: 'Numéro de matricule invalide' });
        }
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token non valide' });
        }
        console.error('Erreur dans la vérification du token:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

router.get('/verify-token', verifyToken, (req, res) => {
    res.json({ isValid: true, numero_identite: req.numero_identite, numero_matricule: req.numero_matricule, id_affilie: req.id_affilie });
});

// Route d'inscription d'un affilié
router.post('/register', async (req, res) => {
    try {
        const {
            nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite
        } = req.body;

        const newAffilie = await affilieGestion.creerAffilie(
            nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite
        );

        const token_user = jwt.sign({ numero_identite: numero_identite, numero_matricule: newAffilie.numero_matricule, id_affilie: newAffilie.id_affilie }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({ message: 'Affilié créé avec succès', affilie: newAffilie, token: token_user });
    } catch (error) {
        if (error.message.includes('existe déjà')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur de la création de l\'affilié', error: error.message });
        }
    }
});

router.post('/auth', async (req, res) => {
    try {
        const { numero_matricule, numero_telephone, numero_identite } = req.body;

        if (!numero_matricule || !numero_telephone || !numero_identite) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        const affilie = await affilieGestion.authentifierAffilie(numero_matricule, numero_telephone, numero_identite);

        const token = jwt.sign({ numero_matricule: numero_matricule, numero_identite: numero_identite, id_affilie: affilie.id_affilie }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token, affilie });
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({ message: 'Informations d\'identification non valides' });
    }
});

router.get('/affilie', verifyToken, async (req, res) => {
    try {
        const affilie = await affilieGestion.fetchAffilie(req.numero_identite, false);
        if (affilie) {
            res.json({ isValid: true, affilie: affilie });
        } else {
            res.status(404).json({ message: 'Affilié non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche de l\'affilié', error: error.message });
    }
});



// Route pour créer un rendez-vous
router.post('/rendez-vous', verifyToken, async (req, res) => {
    try {
        const newRendezVous = {
            id_affilie: req.id_affilie,
            agence: req.body.agence,
            date_rdv: req.body.date_rdv,
            heure_rdv: req.body.heure_rdv === null ? '08:00:00' : req.body.heure_rdv,
            type_service: req.body.type_service || "poser les documents d'inscription"
        };

        await rendezVousGestion.creerRendezVous(newRendezVous);

        return res.status(201).json({ message: 'Rendez-vous créé avec succès', isValid: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error: error.message });
    }
});

// Route pour obtenir les rendez-vous de l'affilié
router.get('/rendez-vous', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVousPourAffilie(req.id_affilie); res.json({ isValid: true, rendezVous: rendezVous });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche des rendez-vous', error: error.message });
    }
});

router.put('/rendez-vous/:appointmentId/annuler', verifyToken, async (req, res) => {
    console.log(req.params.appointmentId, req.id_affilie);
    try {
        const rendezVous = await rendezVousGestion.annulerRendezVous(req.params.appointmentId, req.id_affilie);
        res.json({ rendezVous: rendezVous ,isValid: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'annulation du rendez-vous', error: error.message });
    }
});

// route fetch countries and cities
router.get('/countries', async (req, res) => {
    try {
        const countries = await fetchCountries();
        if (countries) {
            res.json(countries);
        } else {
            res.status(404).json({ message: 'No countries found' });
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/cities/:countryId', async (req, res) => {
    try {
        const cities = await fetchCities(req.params.countryId);
        if (cities) {
            res.json(cities);
        } else {
            res.status(404).json({ message: 'No cities found for this country' });
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/agence', async (req, res) => {
    try {
        const agence = await fetchAgence();
        if (agence) {
            res.json(agence);
        } else {
            res.status(404).json({ message: 'agences non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche des agence', error: error.message });
    }
});

router.get('/service', async (req, res) => {
    try {
        const service = await fetchService();
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'services non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche des service', error: error.message });
    }
});

module.exports = router;