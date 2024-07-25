const { connection } = require('../base_de_donnes/db');

async function fetchAgence() {
    const query = 'SELECT agence FROM agence';
    try {
        const [agence] = await connection.query(query);
        if (agence.length > 0) {
            return agence
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}




module.exports = { fetchAgence };
