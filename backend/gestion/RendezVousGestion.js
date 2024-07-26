const rendezVousDao = require('../dao/RendezVousDao');
const RendezVous = require('../pojo/RendezVous');

class RendezVousGestion {
    async creerRendezVous(rendezVous) {
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
            const result = await rendezVousDao.create(rendezVous); return result;
        } catch (error) {
            console.error('Error in creerRendezVous:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    async obtenirRendezVous(id, id_affilie) {
        try {
            const rendezVous = await rendezVousDao.findById(id);

            if (rendezVous.id_affilie !== id_affilie) {
                throw new Error('Vous n\'êtes pas autorisé à annuler ce rendez-vous');
            }
            
            return rendezVous;
        } catch (error) {
            console.error('Erreur dans obtenirRendezVous:', error);
            throw error;
        }
    }

    async obtenirRendezVousPourAffilie(id_affilie) {
        try {
            const rendezVous = await rendezVousDao.findAllById(id_affilie); return rendezVous;
        } catch (error) {
            console.error('Erreur dans obtenirRendezVousPourAffilie:', error);
            throw error;
        }
    }
    // annulerRendezVous
    async annulerRendezVous(id, id_affilie) {
        try {
            const rendezVous = await rendezVousDao.findById(id); if (!rendezVous) {
                throw new Error('Rendez-vous non trouvé');
            }

            if (new Date(rendezVous.date_rdv) < new Date()) {
                throw new Error('Impossible d\'annuler un rendez-vous passé');
            }

            if (rendezVous.id_affilie !== id_affilie) {
                throw new Error('Vous n\'êtes pas autorisé à annuler ce rendez-vous');
            }

            if (rendezVous.etat_rdv === 'Annulé') {
                throw new Error('Rendez-vous déjà annulé');
            }


            const updated = await rendezVousDao.update({ ...rendezVous, etat_rdv: 'Annulé' });
            return updated;
        } catch (error) {
            console.error('Erreur dans annulerRendezVous:', error);
            throw error;
        }
    }

    async mettreAJourRendezVous(rendezVous) {
        try {
            const existingRdv = await rendezVousDao.findById(rendezVous.numero_rdv);
            if (!existingRdv) {
                throw new Error('Rendez-vous non trouvé');
            }

            if (new Date(existingRdv.date_rdv) < new Date()) {
                throw new Error('Impossible de modifier un rendez-vous passé');
            }

            if (new Date(rendezVous.date_rdv) <= new Date()) {
                throw new Error('La nouvelle date du rendez-vous doit être dans le futur');
            }

            if (rendezVous.type_service === "poser les documents d'inscription") {
                rendezVous.heure_rdv = "08:00:00";
            }
            const updated = await rendezVousDao.update({ ...rendezVous ,agence : rendezVous.agence }); return updated;
        } catch (error) {
            console.error('Erreur dans mettreAJourRendezVous:', error);
            throw error;
        }
    }

    async supprimerRendezVous(id) {
        try {
            const rendezVous = await rendezVousDao.findById(id);
            if (!rendezVous) {
                throw new Error('Rendez-vous non trouvé');
            }

            if (new Date(rendezVous.date_rdv) < new Date()) {
                throw new Error('Impossible de supprimer un rendez-vous passé');
            }

            const deleted = await rendezVousDao.delete(id); return deleted;
        } catch (error) {
            console.error('Erreur dans supprimerRendezVous:', error);
            throw error;
        }
    }
}

module.exports = new RendezVousGestion();
