const { connection } = require('./db');

async function agenceTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS agence (
        agence VARCHAR(50) PRIMARY KEY,
        nombre_employes INT DEFAULT 0
    )
    `;

    try {
        await connection.query(createTableQuery);
        console.log("Table créée avec succès.");
    } catch (error) {
        console.error('Erreur lors de la création de la table :', error);
    }
}

async function insertAgences() {
    const agences = [
        "Agence Belvédère Casablanca",
        "Agence Centrale Casablanca",
        "Agence Marrakech",
        "Agence Rabat",
        "Agence Meknes",
        "Agence Fes",
        "Agence Tanger",
        "Agence Agadir",
        "Agence Oujda"
    ];

    const insertQuery = `
    INSERT INTO agence (agence, nombre_employes) VALUES ?
    `;

    const values = agences.map(agence => [agence, 3]);

    try {
        await connection.query(insertQuery, [values]); 
        console.log("Agences insérées avec succès.");
    } catch (error) {
        console.error('Erreur lors de l\'insertion des agences :', error);
    }
}

async function main() {
    await agenceTable();
    await insertAgences();
}

main();
