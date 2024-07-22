const Affilie = require('../pojo/Affilie');
const { connection } = require('../base_de_donnes/db');

async function findByNumeroIdentite(NumeroIdentite) {
    const query = 'SELECT * FROM affilie WHERE numero_identite = ?';
    try {
        const [rows] = await connection.query(query, [NumeroIdentite]);
        if (rows.length > 0) {
            const affilieData = rows[0];
            return new Affilie(
                affilieData.numero_matricule,
                affilieData.nom,
                affilieData.prenom,
                affilieData.email,
                affilieData.date_naissance,
                affilieData.numero_telephone,
                affilieData.pays,
                affilieData.ville,
                affilieData.type_identite,
                affilieData.numero_identite
            );
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}

async function findByNumeroMatricule(NumeroMatricule) {
    const query = 'SELECT * FROM affilie WHERE numero_matricule = ?';
    try {
        const [rows] = await connection.query(query, [NumeroMatricule]);
        if (rows.length > 0) {
            const affilieData = rows[0];
            return new Affilie(
                affilieData.numero_matricule,
                affilieData.nom,
                affilieData.prenom,
                affilieData.email,
                affilieData.date_naissance,
                affilieData.numero_telephone,
                affilieData.pays,
                affilieData.ville,
                affilieData.type_identite,
                affilieData.numero_identite
            );
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}

async function creerAffilie(nom, prenom, email, date_naissance, numero_telephone,
    pays, ville, type_identite, numero_identite, hashed_matricule) {
    const query = 'INSERT INTO affilie (nom, prenom, email, date_naissance, numero_telephone, pays, ville, type_identite, numero_identite, numero_matricule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await connection.query(query, [nom, prenom, email, date_naissance, numero_telephone,
            pays, ville, type_identite, numero_identite, hashed_matricule]);
        if (result.affectedRows === 1) {
            return new Affilie( nom, prenom, email, date_naissance, numero_telephone,
                pays, ville, type_identite, numero_identite, hashed_matricule);
        } else {
            throw new Error('Erreur 1 de la création de l\'affilié');
        }
    } catch (error) {
        console.error('Erreur 2 de la création de l\'affilié:', error);
        throw error;
    }
}



module.exports = { findByNumeroIdentite, creerAffilie, findByNumeroMatricule };