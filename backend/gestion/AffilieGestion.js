const { findByNumeroIdentite, creerAffilie: creerAffilieDansBD, findByNumeroMatricule } = require('../dao/AffilieDao');
const bcrypt = require('bcrypt');

async function obtenirAffilie(numeroMatricule) {
    try {
        const affilie = await findByNumeroMatricule(numeroMatricule);
        if (!affilie) {
            throw new Error('Affilié non trouvé');
        }
        return affilie;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilié:', error);
        throw error;
    }
}

async function verifierIdentite(numeroMatricule, telephone, numeroIdentite) {
    try {
        const affilie = await findByNumeroMatricule(numeroMatricule);

        if (!affilie || affilie.numero_telephone !== telephone || affilie.numero_identite !== numeroIdentite) {
            throw new Error('Informations d\'identification non valides');
        }

        return affilie;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'identité:', error);
        throw error;
    }
}

async function creerAffilie(nom, prenom, email, dateNaissance, numero_telephone,
    pays, ville, type_identite, numero_identite, numeroMatricule) {
    try {
        const existingAffilie = await findByNumeroIdentite(numero_identite);
        if (existingAffilie) {
            throw new Error('Un affilié avec ce numéro d\'identité existe déjà');
        }

        const hashedMatricule = await bcrypt.hash(numeroMatricule, 10);

        const nouvelAffilie = await creerAffilieDansBD(nom, prenom, email, dateNaissance, numero_telephone,
            pays, ville, type_identite, numero_identite, hashedMatricule);

        return { ...nouvelAffilie, numeroMatricule };
    } catch (error) {
        console.error('Erreur lors de la création de l\'affilié:', error);
        throw error;
    }
}

async function authentifierAffilie(numeroMatricule, telephone, numeroIdentite) {
    try {
        const affilie = await findByNumeroMatricule(numeroMatricule);

        if (!affilie || affilie.numero_telephone !== telephone || affilie.numero_identite !== numeroIdentite) {
            throw new Error('Informations d\'identification non valides');
        }

        const isMatriculeValid = await bcrypt.compare(numeroMatricule, affilie.numero_matricule);
        if (!isMatriculeValid) {
            throw new Error('Informations d\'identification non valides');
        }

        return affilie;
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        throw error;
    }
}

module.exports = { obtenirAffilie, verifierIdentite, creerAffilie, authentifierAffilie };
