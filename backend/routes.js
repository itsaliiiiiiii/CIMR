const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { RendezVous } = require('./pojo/RendezVous');

const affilieGestion = require('./gestion/AffilieGestion');
const rendezVousGestion = require('./gestion/RendezVousGestion');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'Aucun token fourni' });

    const token = authHeader.split(' ')[1]; // Cette ligne extrait le token après "Bearer"
    if (!token) return res.status(403).json({ message: 'Format de token invalide' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token non valide' });
        req.numero_matricule = decoded.numero_matricule;
        req.numero_identite = decoded.numero_identite;
        next();
    });
};

// Fonction pour générer le numéro de matricule
const generateMatricule = (nom, prenom, date_naissance) => {
    const firstLetterNom = nom.charAt(0).toUpperCase();
    const firstLetterPrenom = prenom.charAt(0).toUpperCase();

    const date = new Date(date_naissance);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const datePart = day + month + year;

    const generateRandomChars = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array(4).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    return `${firstLetterNom}${firstLetterPrenom}${datePart}${generateRandomChars()}`;
};

// Route d'inscription d'un affilié
router.post('/register', async (req, res) => {
    try {
        const {
            nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite
        } = req.body;

        const numero_matricule = generateMatricule(nom, prenom, date_naissance);
        const newAffilie = await affilieGestion.creerAffilie(
            nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite, numero_matricule
        );
        const token_user = jwt.sign({ numero_matricule: numero_matricule, numero_identite: numero_identite }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({ message: 'Affilié créé avec succès', affilie: newAffilie, token: token_user });
    } catch (error) {
        if (error.message.includes('existe déjà')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur 4 de la création de l\'affilié', error: error.message });
        }
    }
});

router.post('/auth', async (req, res) => {
    try {
        const { numero_matricule, numero_telephone, numero_identite } = req.body;

        const affilie = await affilieGestion.authentifierAffilie(numero_matricule, numero_telephone, numero_identite);

        const token = jwt.sign({ numero_matricule: numero_matricule, numero_identite: numero_identite }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ token, affilie });
    } catch (error) {
        res.status(401).json({ message: 'Informations d\'identification non valides' });
    }
});


// Route pour obtenir les informations de l'affilié
router.get('/affilie', verifyToken, async (req, res) => {
    try {
        const affilie = await affilieGestion.obtenirAffilie(req.userId);
        if (affilie) {
            res.json(affilie);
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
        const decoded = bcrypt.compare(req.body.numero_matricule, req.numero_matricule);

        console.log(decoded.numero_matricule);
        console.log(req.numero_identite);
        console.log(req.body.numero_identite);

        if (!decoded || req.numero_identite != req.body.numero_identite) {
            return res.status(404).json({ message: 'Affilié non trouvé. Impossible de créer un rendez-vous.' });
        }

        const newRendezVous = {
            numero_matricule: req.body.numero_matricule,
            agence: req.body.agence,
            date_rdv: req.body.date_rdv,
            heure_rdv: req.body.heure_rdv === null ? '08:00:00' : req.body.heure_rdv,
            type_service: req.body.type_service || "poser les documents d'inscription"
        };

        const rendezVousId = await rendezVousGestion.creerRendezVous(newRendezVous);

        return res.status(201).json({ message: 'Rendez-vous créé avec succès', id: rendezVousId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error: error.message });
    }
});

// Route pour obtenir les rendez-vous de l'affilié
router.get('/rendez-vous', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVousPourAffilie(req.numero_matricule);
        res.json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche des rendez-vous', error: error.message });
    }
});

// Route pour mettre à jour un rendez-vous
router.put('/rendez-vous/:id', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVous(req.params.id);
        if (!rendezVous || rendezVous.numero_matricule !== req.userId) {
            return res.status(403).json({ message: 'Accès non autorisé à ce rendez-vous' });
        }

        const updatedRendezVous = new RendezVous(
            req.params.id,
            req.userId,
            req.body.agence,
            req.body.heure_rdv,
            req.body.date_rdv,
            'poser les documents d\'inscription'
        );
        const updated = await rendezVousGestion.mettreAJourRendezVous(updatedRendezVous);
        if (updated) {
            res.json({ message: 'Rendez-vous mis à jour avec succès' });
        } else {
            res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }
    } catch (error) {
        if (error.message === 'Impossible de modifier un rendez-vous passé') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error: error.message });
        }
    }
});

// Route pour supprimer un rendez-vous
router.delete('/rendez-vous/:id', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVous(req.params.id);
        if (!rendezVous || rendezVous.numero_matricule !== req.userId) {
            return res.status(403).json({ message: 'Accès non autorisé à ce rendez-vous' });
        }

        await rendezVousGestion.supprimerRendezVous(req.params.id);
        res.json({ message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
        if (error.message === 'Impossible de supprimer un rendez-vous passé') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la suppression du rendez-vous', error: error.message });
        }
    }
});

module.exports = router;