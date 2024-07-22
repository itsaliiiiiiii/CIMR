const rendezVousDao = require('../dao/RendezVousDao');
const RendezVous = require('../pojo/RendezVous');

class RendezVousGestion {
    async creerRendezVous(rendezVous) {
        console.log('Entering creerRendezVous with:', rendezVous);
        try {
            if (!rendezVous.date_rdv || !rendezVous.heure_rdv) {
                throw new Error('La date et l\'heure du rendez-vous sont requises');
            }

            const dateRdv = new Date(`${rendezVous.date_rdv}T${rendezVous.heure_rdv}`);
            const now = new Date();

            if (isNaN(dateRdv.getTime())) {
                throw new Error('Date ou heure du rendez-vous invalide');
            }

            if (dateRdv <= now) {
                throw new Error('La date et l\'heure du rendez-vous doivent être dans le futur');
            }

            console.log('Attempting to create rendez-vous in database');
            const result = await rendezVousDao.create(rendezVous);
            console.log('Rendez-vous created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error in creerRendezVous:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    async obtenirRendezVous(id) {
        console.log('Début de obtenirRendezVous avec ID:', id);
        try {
            const rendezVous = await rendezVousDao.findById(id);
            console.log('Rendez-vous obtenu:', rendezVous);
            return rendezVous;
        } catch (error) {
            console.error('Erreur dans obtenirRendezVous:', error);
            throw error;
        }
    }

    async obtenirRendezVousPourAffilie(numero_matricule) {
        console.log('Début de obtenirRendezVousPourAffilie avec numéro de matricule:', numero_matricule);
        try {
            const rendezVous = await rendezVousDao.findAllByNumeroMatricule(numero_matricule);
            console.log('Rendez-vous obtenus pour l\'affilié:', rendezVous);
            return rendezVous;
        } catch (error) {
            console.error('Erreur dans obtenirRendezVousPourAffilie:', error);
            throw error;
        }
    }

    async mettreAJourRendezVous(rendezVous) {
        console.log('Début de mettreAJourRendezVous avec:', rendezVous);
        try {
            const existingRdv = await rendezVousDao.findById(rendezVous.id);
            if (!existingRdv) {
                console.log('Erreur: Rendez-vous non trouvé');
                throw new Error('Rendez-vous non trouvé');
            }

            if (new Date(existingRdv.date_rdv) < new Date()) {
                console.log('Erreur: Tentative de modification d\'un rendez-vous passé');
                throw new Error('Impossible de modifier un rendez-vous passé');
            }

            if (new Date(rendezVous.date_rdv) <= new Date()) {
                console.log('Erreur: La nouvelle date du rendez-vous est dans le passé');
                throw new Error('La nouvelle date du rendez-vous doit être dans le futur');
            }

            if (rendezVous.type_service === "poser les documents d'inscription") {
                rendezVous.heure_rdv = "08:00:00";
                console.log('Heure du rendez-vous fixée à 08:00:00 pour le dépôt de documents');
            }

            const updated = await rendezVousDao.update(rendezVous);
            console.log('Mise à jour du rendez-vous réussie:', updated);
            return updated;
        } catch (error) {
            console.error('Erreur dans mettreAJourRendezVous:', error);
            throw error;
        }
    }

    async supprimerRendezVous(id) {
        console.log('Début de supprimerRendezVous avec ID:', id);
        try {
            const rendezVous = await rendezVousDao.findById(id);
            if (!rendezVous) {
                console.log('Erreur: Rendez-vous non trouvé');
                throw new Error('Rendez-vous non trouvé');
            }

            if (new Date(rendezVous.date_rdv) < new Date()) {
                console.log('Erreur: Tentative de suppression d\'un rendez-vous passé');
                throw new Error('Impossible de supprimer un rendez-vous passé');
            }

            const deleted = await rendezVousDao.delete(id);
            console.log('Suppression du rendez-vous réussie:', deleted);
            return deleted;
        } catch (error) {
            console.error('Erreur dans supprimerRendezVous:', error);
            throw error;
        }
    }
}

module.exports = new RendezVousGestion();
