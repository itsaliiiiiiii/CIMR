const rendezVousDao = require('../dao/RendezVousDao');
const DataDao = require('../dao/DataDao');


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

            if (dateRdv.getDay() === 0 || dateRdv.getDay() === 6) {
                throw new Error('Le rendez-vous doit être pris en semaine');
            }

            if (dateRdv.getHours() < 8 || dateRdv.getHours() > 16) {
                throw new Error('L\'heure du rendez-vous doit être entre 8h et 16h');
            }

            const status_documents_affilie = await rendezVousDao.status_documents_affilie(rendezVous.id_affilie);
            console.log(status_documents_affilie[0][0].statusDocuments);

            if (status_documents_affilie[0][0].statusDocuments == "En attente" && rendezVous.type_service != "POSER LES DOCUMENTS D'INSCRIPTION") {  // status_documents
                throw new Error('inscription');
            }

            const nombreRdvMemeDateHeureAgence = await DataDao.countRdvHeureDateAgence(rendezVous.agence, rendezVous.date_rdv, rendezVous.heure_rdv);
            const nombreEmployesAgence = await DataDao.countEmployesAgence(rendezVous.agence);

            if (nombreRdvMemeDateHeureAgence[0][0].nombreRendezVous >= nombreEmployesAgence[0][0].nombre_employes) {
                throw new Error('full');
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

            if (new Date(rendezVous.date_rdv).getDay() === 0 || new Date(rendezVous.date_rdv).getDay() === 6) {
                throw new Error('Le rendez-vous doit être pris en semaine');
            }

            if (new Date(rendezVous.heure_rdv).getHours() < 8 || new Date(rendezVous.heure_rdv).getHours() > 16) {
                throw new Error('L\'heure du rendez-vous doit être entre 8h et 16h');
            }

            const status_documents_affilie = await rendezVousDao.status_documents_affilie(rendezVous.id_affilie);

            if (status_documents_affilie[0][0].statusDocuments == "En attente" && rendezVous.type_service != "POSER LES DOCUMENTS D'INSCRIPTION") {  // status_documents
                throw new Error('inscription');
            }

            const nombreRdvMemeDateHeureAgence = await DataDao.countRdvHeureDateAgence(rendezVous.agence, rendezVous.date_rdv, rendezVous.heure_rdv);
            const nombreEmployesAgence = await DataDao.countEmployesAgence(rendezVous.agence);

            if (nombreRdvMemeDateHeureAgence[0][0].nombreRendezVous >= nombreEmployesAgence[0][0].nombre_employes) {
                throw new Error('full');
            }

            const updated = await rendezVousDao.update({ ...rendezVous });
            return updated;
        } catch (error) {
            console.error('Erreur dans mettreAJourRendezVous:', error);
            throw error;
        }
    }
}

module.exports = new RendezVousGestion();
