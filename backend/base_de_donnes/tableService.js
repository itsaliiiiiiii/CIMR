const { connection } = require('./db');

async function serviceTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS service (
        service VARCHAR(200) PRIMARY KEY
    )
    `;

    try {
        await connection.query(createTableQuery);
        console.log("Table créée avec succès.");
    } catch (error) {
        console.error('Erreur lors de la création de la table :', error);
    }
}

async function insertServices() {
    const agences = [
        "POSER LES DOCUMENTS D'INSCRIPTION",
        "ARENSEIGNEMENT AVANT DEPART A LA RETRAITE ",
        "DEPOT DU DOSSIER DE LIQUIDATION DE PENSION",
        "RENSEIGNEMENT APRES DEPOT DU DOSSIER DE LIQUIDATION DE PENSION",
        "RENSEIGNEMENT SUR LE PAIEMENT DE LA PENSION ET DU CAPITAL",
        "MISE A JOUR DES INFORMATIONS PERSONNELLES",
        "CHANGEMENT DU MODE DE PAIEMENT",
        "DEPOT DES PIECES JUSTIFICATIVES DE PAIEMENT",
        "DEMANDE D ATTESTATION DES RETRAITES",
        "DEPOT DES PIECES CONSTITUTIVES DU CAPITAL DECES"
    ];

    const insertQuery = `
    INSERT INTO service (service) VALUES ?
    `;

    try {
        const values = agences.map(agence => [agence]);
        await connection.query(insertQuery, [values]);
        console.log("Services insérées avec succès.");
    } catch (error) {
        console.error('Erreur lors de l\'insertion des agences :', error);
    }
}

async function main() {
    await serviceTable();
    await insertServices();
}

main();
