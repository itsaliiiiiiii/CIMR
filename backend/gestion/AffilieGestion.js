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

async function verifierAffilieExiste(numeroMatricule) {
    try {
        const affilie = await findByNumeroMatricule(numeroMatricule);
        return !!affilie;
    } catch (error) {
        console.error('Error in verifierAffilieExiste:', error);
        throw error;
    }
}

async function creerAffilie(nom, prenom, email, date_naissance, numero_telephone,
    pays, ville, type_identite, numero_identite, numero_matricule) {
    try {
        const existingAffilie = await findByNumeroIdentite(numero_identite);
        if (existingAffilie) {
            throw new Error('Un affilié avec ce numéro d\'identité existe déjà');
        }

        const hashed_matricule = await bcrypt.hash(numero_matricule, 10);

        const nouvelAffilie = await creerAffilieDansBD(nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite, hashed_matricule);
        return { nouvelAffilie };
    } catch (error) {
        console.error('Erreur 3 de la création:', error);
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

module.exports = { obtenirAffilie, verifierIdentite, creerAffilie, authentifierAffilie, verifierAffilieExiste };
