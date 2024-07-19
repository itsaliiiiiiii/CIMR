const Affilie = require('../pojo/Affilie');
const { connection } = require('../base_de_donnes/db');

async function findByNumeroMatricule(numeroMatricule) {
    const query = 'SELECT * FROM affilie WHERE numero_matricule = ?';
    try {
        const [rows] = await connection.query(query, [numeroMatricule]);
        console.log(rows[0]) ;
        if (rows.length > 0) {
            const affilieData = rows[0];
            return new Affilie(
                affilieData.numero_matricule,
                affilieData.nom,
                affilieData.prenom,
                affilieData.email,
                affilieData.numero_telephone,
                affilieData.pays,
                affilieData.ville,
                affilieData.numero_identite
            );
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}

async function creerAffilie(numeroMatricule, nom, prenom, email, telephone, pays, ville, numeroIdentite) {
    const query = 'INSERT INTO affilie (numero_matricule, nom, prenom, email, numero_telephone, pays, ville, numero_identite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const existingAffilie = await findByNumeroMatricule(numeroMatricule);
        if (existingAffilie) {
            throw new Error('Un affilié avec ce numéro de matricule existe déjà');
        }

        const [result] = await connection.query(query, [numeroMatricule, nom, prenom, email, telephone, pays, ville, numeroIdentite]);
        if (result.affectedRows === 1) {
            return new Affilie(numeroMatricule, nom, prenom, email, telephone, pays, ville, numeroIdentite);
        } else {
            throw new Error('Erreur lors de la création de l\'affilié');
        }
    } catch (error) {
        console.error('Erreur lors de la création de l\'affilié:', error);
        throw error;
    }
}

module.exports = { findByNumeroMatricule, creerAffilie };