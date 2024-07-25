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

async function fetchService() {
    const query = 'SELECT service FROM service';
    try {
        const [service] = await connection.query(query);
        if (service.length > 0) {
            return service
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'affilie:', error);
        throw error;
    }
}

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

module.exports = { fetchAgence, fetchService ,fetchCountries, fetchCities };