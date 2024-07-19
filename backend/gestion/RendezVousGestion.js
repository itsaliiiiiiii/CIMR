const { RendezVousDao } = require('../dao/RendezVousDao');
const RendezVous = require('../pojo/RendezVous');

class RendezVousGestion {
    constructor() {
        this.rendezVousDao = new RendezVousDao();
    }

    async creerRendezVous(rendezVous) {
        const dateRdv = new Date(rendezVous.dateRdv);
        const now = new Date();

        if (dateRdv <= now) {
            throw new Error('La date du rendez-vous doit être dans le futur');
        }

        return await this.rendezVousDao.create(rendezVous);
    }

    async obtenirRendezVous(numeroRdv) {
        return await this.rendezVousDao.findByNumeroRdv(numeroRdv);
    }

    async obtenirRendezVousPourAffilie(numeroMatricule) {
        return await this.rendezVousDao.findAllByNumeroMatricule(numeroMatricule);
    }

    async mettreAJourRendezVous(rendezVous) {
        const existingRdv = await this.rendezVousDao.findByNumeroRdv(rendezVous.numeroRdv);
        if (!existingRdv) {
            throw new Error('Rendez-vous non trouvé');
        }
        
        if (new Date(existingRdv.dateRdv) < new Date()) {
            throw new Error('Impossible de modifier un rendez-vous passé');
        }

        return await this.rendezVousDao.update(rendezVous);
    }

    async supprimerRendezVous(numeroRdv) {
        const rendezVous = await this.rendezVousDao.findByNumeroRdv(numeroRdv);
        if (!rendezVous) {
            throw new Error('Rendez-vous non trouvé');
        }

        if (new Date(rendezVous.dateRdv) < new Date()) {
            throw new Error('Impossible de supprimer un rendez-vous passé');
        }

        return await this.rendezVousDao.delete(numeroRdv);
    }
}

module.exports = { RendezVousGestion };