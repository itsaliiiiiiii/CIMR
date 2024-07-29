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

async function countEmployesAgence(agence) {
    const query = 'SELECT nombre_employes FROM agence WHERE agence = ?';
    try {
        return await connection.query(query, agence);

    } catch (error) {
        console.error('erreur count nombre agence', error);
        throw error;
    }
}

async function countRdvHeureDateAgence(agence, date_rdv, heure_rdv){
    const query = 'SELECT COUNT(*)  AS nombreRendezVous FROM rendez_vous WHERE agence = ? AND date_rdv = ? AND heure_rdv = ? AND NOT etat_rdv = "Annulé"';
    try {
        return await connection.query(query, [agence, date_rdv, heure_rdv]);
    } catch (error) {
        console.error('erreur count nombre agence', error);
        throw error;
    }
}

module.exports = { fetchAgence, fetchService, fetchCountries, fetchCities, countEmployesAgence, countRdvHeureDateAgence };