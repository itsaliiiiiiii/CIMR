const { findByNumeroIdentite, creerAffilie: creerAffilieDansBD, findByNumeroMatricule, findByEmail, findByTelephone, findById } = require('../dao/AffilieDao');
const bcrypt = require('bcrypt');

async function obtenirAffilie(matricule) {
    try {
        const affilie = await findByNumeroMatricule(matricule);
        if (!affilie) {
            throw new Error('Affilié non trouvé');
        }
        return affilie;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilié:', error);
        throw error;
    }
}

async function fetchAffilie(id_affilie, withMatricule) {
    try {
        const affilie = await findByNumeroIdentite(id_affilie);
        if (!affilie) {
            throw new Error('Affilié non trouvé');
        }

        if (!withMatricule) {
            affilie.numero_matricule = null;
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
const generateMatricule = (nom, prenom, date_naissance) => {
    const firstLetterNom = nom.charAt(0).toUpperCase();
    const firstLetterPrenom = prenom.charAt(0).toUpperCase();

    const date = new Date(date_naissance);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const datePart = day + month + year;

    const generateRandomChars = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array(4).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    return `${firstLetterNom}${firstLetterPrenom}${datePart}${generateRandomChars()}`;
};

async function creerAffilie(nom, prenom, email, date_naissance, numero_telephone,
    pays, ville, type_identite, numero_identite) {
    try {
        if (!nom || !prenom || !email || !date_naissance || !numero_telephone || !pays || !ville || !type_identite || !numero_identite) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        if(nom.length < 3 || prenom.length < 3 || !/^[a-zA-Z]+$/.test(nom) || !/^[a-zA-Z]+$/.test(prenom)) 
        {
            return res.status(400).json({ message: 'Le nom et le prénom doivent contenir au moins 3 lettres' });
        }

        const existingAffilie = await findByNumeroIdentite(numero_identite);
        if (existingAffilie) {
            throw new Error('Un affilié avec ce numéro d\'identité existe déjà');
        }

        const existingAffilie2 = await findByEmail(email);
        if (existingAffilie2) {
            throw new Error('Un affilié avec ce email d\'identité existe déjà');
        }

        const existingAffilie3 = await findByTelephone(numero_telephone);
        if (existingAffilie3) {
            throw new Error('Un affilié avec ce numéro telephone existe déjà');
        }

        const numero_matricule = generateMatricule(nom, prenom, date_naissance);

        const hashed_matricule = await bcrypt.hash(numero_matricule, 10);

        const nouvelAffilie = await creerAffilieDansBD(nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite, hashed_matricule);
        return { ...nouvelAffilie, numero_matricule: numero_matricule };
    } catch (error) {
        console.error('Erreur de la création:', error);
        throw error;
    }
}

async function authentifierAffilie(numero_matricule, numero_telephone, numero_identite) {
    try {
        const affilie = await findByNumeroIdentite(numero_identite, false);
        if (!affilie) {
            throw new Error('Affilié non trouvé');
        }

        const isMatriculeValid = await bcrypt.compare(numero_matricule, affilie.numero_matricule);
        if (!isMatriculeValid) {
            throw new Error('Numéro de matricule invalide');
        }

        if (affilie.numero_telephone !== numero_telephone) {
            throw new Error('Numéro de téléphone invalide');
        }

        return affilie;
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        throw error;
    }
}

module.exports = { obtenirAffilie, verifierIdentite, creerAffilie, authentifierAffilie, verifierAffilieExiste, fetchAffilie };
