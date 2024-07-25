const mysql = require('mysql2/promise');
const axios = require('axios');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CIMR',
};

async function createTables(connection) {
    const createCountriesTable = `
    CREATE TABLE IF NOT EXISTS countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100)  NOT NULL,
    country_code CHAR(2) NOT NULL UNIQUE
    )
`;

    const createCitiesTable = `
    CREATE TABLE IF NOT EXISTS cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
    )
`;

    await connection.execute(createCountriesTable);
    await connection.execute(createCitiesTable);

    console.log('Tables and indexes created successfully');
}

// Function to fetch countries and cities with improved logging
async function fetchCountriesAndCities() {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries');
        const data = response.data.data;
        console.log(`Fetched ${data.length} countries`);

        let totalCities = 0;
        data.forEach(country => {
            totalCities += country.cities.length;
            console.log(`${country.country}: ${country.cities.length} cities`);
        });

        console.log(`Total cities fetched: ${totalCities}`);

        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        if (error.response) {
            console.error('API response:', error.response.data);
        }
        return [];
    }
}

// Function to insert countries and cities with improved logging
async function insertCountriesAndCities(connection, data) {
    let insertedCountries = 0;
    let insertedCities = 0;

    for (const country of data) {
        try {
            // Insert country
            const [countryResult] = await connection.execute(
                'INSERT INTO countries (country_name, country_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE country_name = VALUES(country_name)',
                [country.country, country.iso2]
            );

            const countryId = countryResult.insertId || countryResult.updateId;
            insertedCountries++;

            // Insert cities
            for (const city of country.cities) {
                await connection.execute(
                    'INSERT INTO cities (city_name, country_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE city_name = VALUES(city_name)',
                    [city, countryId]
                );
                insertedCities++;
            }

            console.log(`Inserted ${country.country} with ${country.cities.length} cities`);
        } catch (error) {
            console.error(`Error inserting ${country.country}:`, error.message);
        }
    }

    console.log(`Total countries inserted/updated: ${insertedCountries}`);
    console.log(`Total cities inserted/updated: ${insertedCities}`);
}

// Main function
async function main() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        console.log('Creating tables...');
        await createTables(connection);

        console.log('Fetching countries and cities data...');
        const data = await fetchCountriesAndCities();

        if (data.length === 0) {
            console.log('No data fetched. Exiting.');
            return;
        }

        console.log('Inserting data into the database...');
        await insertCountriesAndCities(connection, data);

        console.log('Data insertion completed successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main();