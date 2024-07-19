const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { RendezVous } = require('./pojo/Rendezvous');



const affilieGestion = require('./gestion/AffilieGestion');
const rendezVousGestion = require('./gestion/RendezVousGestion');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Aucun token fourni' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token non valide' });
        req.userId = decoded.id;
        next();
    });
};

// Route d'authentification
router.post('/auth', async (req, res) => {
    console.log('Tentative d\'authentification reçue:', req.body);
    try {
        const { numeroMatricule, telephone, numeroIdentite } = req.body;

        console.log('Vérification de l\'identité pour:', numeroMatricule);
        const affilie = await affilieGestion.obtenirAffilie(numeroMatricule);

        if (!affilie || affilie.numeroTelephone !== telephone || affilie.numeroIdentite !== numeroIdentite) {
            throw new Error('Informations d\'identification non valides');
        }

        const isMatriculeValid = await bcrypt.compare(numeroMatricule, affilie.numeroMatricule);
        if (!isMatriculeValid) {
            throw new Error('Informations d\'identification non valides');
        }

        console.log('Identité vérifiée, création du token');
        const token = jwt.sign({ id: numeroMatricule }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        console.log('Token créé avec succès');
        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
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

router.post('/affilie', async (req, res) => {
    try {
        const { nom, prenom, email, telephone, pays, ville, numeroIdentite } = req.body;

        const newAffilie = await affilieGestion.creerAffilie(
            nom,
            prenom,
            email,
            telephone,
            pays,
            ville,
            numeroIdentite
        );

        res.status(201).json({ message: 'Affilié créé avec succès', affilie: newAffilie });
    } catch (error) {
        if (error.message.includes('déjà utilisé')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la création de l\'affilié', error: error.message });
        }
    }
});

// Route pour créer un rendez-vous
router.post('/rendez-vous', verifyToken, async (req, res) => {
    try {
        const newRendezVous = new RendezVous(
            null,
            req.userId,
            req.body.agence,
            req.body.heureRdv,
            req.body.dateRdv,
            req.body.typeService
        );
        const rendezVousId = await rendezVousGestion.creerRendezVous(newRendezVous);
        res.status(201).json({ message: 'Rendez-vous créé avec succès', id: rendezVousId });
    } catch (error) {
        if (error.message === 'La date du rendez-vous doit être dans le futur') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error: error.message });
        }
    }
});

// Route pour obtenir les rendez-vous de l'affilié
router.get('/rendez-vous', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVousPourAffilie(req.userId);
        res.json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la recherche des rendez-vous', error: error.message });
    }
});

// Route pour mettre à jour un rendez-vous
router.put('/rendez-vous/:id', verifyToken, async (req, res) => {
    try {
        const rendezVous = await rendezVousGestion.obtenirRendezVous(req.params.id);
        if (!rendezVous || rendezVous.numeroMatricule !== req.userId) {
            return res.status(403).json({ message: 'Accès non autorisé à ce rendez-vous' });
        }

        const updatedRendezVous = new RendezVous(
            req.params.id,
            req.userId,
            req.body.agence,
            req.body.heureRdv,
            req.body.dateRdv,
            req.body.typeService
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
        if (!rendezVous || rendezVous.numeroMatricule !== req.userId) {
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