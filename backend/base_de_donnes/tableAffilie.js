const { connection } = require('./db');

async function createAffilieTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS affilie (
    numero_matricule VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL,
    pays VARCHAR(50) NOT NULL,
    statusDocuments VARCHAR(50) DEFAULT 'En attente',
    ville VARCHAR(50) NOT NULL,
    type_identite VARCHAR(50) NOT NULL,
    numero_identite VARCHAR(50) NOT NULL
    )
`;

    try {
        await connection.query(createTableQuery);
        console.log("done");
    } catch (error) {
        console.error('Erreur de creation table Affilie', error);
    }
}

createAffilieTable();