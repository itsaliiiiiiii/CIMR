const { AffilieDao } = require('../dao/AffilieDao');
const Affilie = require('../pojo/Affilie');

class AffilieGestion {
    constructor() {
        this.affilieDao = new AffilieDao();
    }

    async obtenirAffilie(numeroMatricule) {
        try {
            const affilie = await this.affilieDao.findByNumeroMatricule(numeroMatricule);
            if (!affilie) {
                throw new Error('Affilié non trouvé');
            }
            return affilie;
        } catch (error) {
            console.error('Erreur lors de la recherche de l\'affilié:', error);
            throw error;
        }
    }

    async verifierIdentite(numeroMatricule, telephone, numeroIdentite) {
        try {
            const affilie = await this.obtenirAffilie(numeroMatricule);

            if (affilie.numeroTelephone !== telephone || affilie.numeroIdentite !== numeroIdentite) {
                throw new Error('Informations d\'identification non valides');
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'identité:', error);
            throw error;
        }
    }
}

module.exports = { AffilieGestion };   