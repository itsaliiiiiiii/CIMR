const { connection } = require('./db');

async function createAffilieTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS affilie (
    id_affilie INT AUTO_INCREMENT PRIMARY KEY,
    numero_matricule VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_naissance DATE NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL UNIQUE,
    pays VARCHAR(100) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    status_documents VARCHAR(50) DEFAULT 'En attente',
    type_identite VARCHAR(50) NOT NULL,
    numero_identite VARCHAR(50) NOT NULL UNIQUE
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