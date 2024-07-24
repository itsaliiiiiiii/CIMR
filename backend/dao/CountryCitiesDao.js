const { connection } = require('../base_de_donnes/db');

async function fetchCountries() {
    const query = 'SELECT * FROM countries';
    try {
        const [countries] = await connection.query(query);
        if (countries.length > 0) {
            return countries
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}

async function fetchCities(idCountry) {
    const query = 'SELECT * FROM cities WHERE country_id = ?';
    try {
        const [Cities] = await connection.query(query, [idCountry]);
        if (Cities.length > 0) {
            return Cities
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}


module.exports = { fetchCountries, fetchCities };
