const rendezVousDao = require('../dao/RendezVousDao');
const RendezVous = require('../pojo/RendezVous');

class RendezVousGestion {
    async creerRendezVous(rendezVous) {
        const dateRdv = new Date(rendezVous.dateRdv);
        const now = new Date();

        if (dateRdv <= now) {
            throw new Error('La date du rendez-vous doit être dans le futur');
        }

        // Vérifier si l'affilié a déjà un rendez-vous pour déposer les documents
        const rendezVousExistants = await this.obtenirRendezVousPourAffilie(rendezVous.numeroMatricule);
        const rendezVousDepotDocuments = rendezVousExistants.find(rdv => rdv.typeService === "poser les documents d'inscription");

        if (rendezVousDepotDocuments) {
            throw new Error('Vous avez déjà un rendez-vous prévu pour déposer vos documents d\'inscription');
        }

        // Si c'est un rendez-vous pour déposer les documents, fixer l'heure à 8:00
        if (rendezVous.typeService === "poser les documents d'inscription") {
            rendezVous.heureRdv = "08:00:00";
        }

        return await rendezVousDao.create(rendezVous);
    }

    async obtenirRendezVous(numeroRdv) {
        return await rendezVousDao.findByNumeroRdv(numeroRdv);
    }

    async obtenirRendezVousPourAffilie(numeroMatricule) {
        return await rendezVousDao.findAllByNumeroMatricule(numeroMatricule);
    }

    async mettreAJourRendezVous(rendezVous) {
        const existingRdv = await rendezVousDao.findByNumeroRdv(rendezVous.numeroRdv);
        if (!existingRdv) {
            throw new Error('Rendez-vous non trouvé');
        }

        if (new Date(existingRdv.dateRdv) < new Date()) {
            throw new Error('Impossible de modifier un rendez-vous passé');
        }

        // Vérifier si la nouvelle date est dans le futur
        if (new Date(rendezVous.dateRdv) <= new Date()) {
            throw new Error('La nouvelle date du rendez-vous doit être dans le futur');
        }

        // Si c'est un rendez-vous pour déposer les documents, s'assurer que l'heure reste 8:00
        if (rendezVous.typeService === "poser les documents d'inscription") {
            rendezVous.heureRdv = "08:00:00";
        }

        return await rendezVousDao.update(rendezVous);
    }

    async supprimerRendezVous(numeroRdv) {
        const rendezVous = await rendezVousDao.findByNumeroRdv(numeroRdv);
        if (!rendezVous) {
            throw new Error('Rendez-vous non trouvé');
        }

        if (new Date(rendezVous.dateRdv) < new Date()) {
            throw new Error('Impossible de supprimer un rendez-vous passé');
        }

        return await rendezVousDao.delete(numeroRdv);
    }
}

module.exports = new RendezVousGestion();