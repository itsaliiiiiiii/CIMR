const Affilie = require('./Affilie');
const { pool } = require('./db');

class AffilieDao {
    async findByNumeroMatricule(numeroMatricule) {
        const query = 'SELECT * FROM affilie WHERE numero_matricule = ?';
        try {
            const [rows] = await pool.query(query, [numeroMatricule]);
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
}

module.exports = { AffilieDao };