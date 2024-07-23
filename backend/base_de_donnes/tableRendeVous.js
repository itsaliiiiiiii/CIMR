const { connection } = require('./db');

async function createRendezVousTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS rendez_vous (
    numero_rdv INT AUTO_INCREMENT PRIMARY KEY,
    numero_matricule VARCHAR(100) NOT NULL,
    agence VARCHAR(100) NOT NULL,
    heure_rdv TIME NOT NULL,
    date_rdv DATE NOT NULL,
    type_service VARCHAR(100) NOT NULL
    )
    `;

    try {
        await connection.query(createTableQuery);
        console.log("done");
    } catch (error) {
        console.error('Erreur creation table RendezVous:', error);
    }
}

createRendezVousTable();