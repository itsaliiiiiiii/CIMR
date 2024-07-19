const { findByNumeroMatricule, creerAffilie: creerAffilieDansBD } = require('../dao/AffilieDao');
const crypto = require('crypto');
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

        if (!affilie || affilie.numeroTelephone !== telephone || affilie.numeroIdentite !== numeroIdentite) {
            throw new Error('Informations d\'identification non valides');
        }

        return affilie;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'identité:', error);
        throw error;
    }
}

function genererNumeroMatricule() {
    return crypto.randomBytes(4).toString('hex');
}

async function creerAffilie(nom, prenom, email, telephone, pays, ville, numeroIdentite) {
    try {
        const existingAffilie = await findByNumeroMatricule(numeroIdentite);
        if (existingAffilie) {
            if (existingAffilie.email === email) {
                throw new Error('Cet email est déjà utilisé');
            }
            if (existingAffilie.numeroTelephone === telephone) {
                throw new Error('Ce numéro de téléphone est déjà utilisé');
            }
            if (existingAffilie.numeroIdentite === numeroIdentite) {
                throw new Error('Ce numéro d\'identité est déjà utilisé');
            }
        }

        let numeroMatricule;
        let existingMatricule;
        do {
            numeroMatricule = genererNumeroMatricule();
            existingMatricule = await findByNumeroMatricule(numeroMatricule);
        } while (existingMatricule);

        const hashedMatricule = await bcrypt.hash(numeroMatricule, 10);

        const nouvelAffilie = await creerAffilieDansBD(hashedMatricule, nom, prenom, email, telephone, pays, ville, numeroIdentite);

        return { ...nouvelAffilie, numeroMatricule };
    } catch (error) {
        console.error('Erreur lors de la création de l\'affilié:', error);
        throw error;
    }
}

async function authentifierAffilie(numeroMatricule, telephone, numeroIdentite) {
    try {
        const affilie = await findByNumeroMatricule(numeroMatricule);

        if (!affilie || affilie.numeroTelephone !== telephone || affilie.numeroIdentite !== numeroIdentite) {
            throw new Error('Informations d\'identification non valides');
        }

        const isMatriculeValid = await bcrypt.compare(numeroMatricule, affilie.numeroMatricule);
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