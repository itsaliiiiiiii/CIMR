const { connection } = require('./db');

async function createRendezVousTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS rendez_vous (
    numero_rdv INT AUTO_INCREMENT PRIMARY KEY,
    id_affilie INT ,
    agence VARCHAR(50) NOT NULL,
    heure_rdv TIME NOT NULL,
    date_rdv DATE NOT NULL,
    type_service VARCHAR(100) NOT NULL,
    etat_rdv VARCHAR(100) DEFAULT 'Prévu',
    FOREIGN KEY (id_affilie) REFERENCES affilie(id_affilie) ON DELETE CASCADE,
    FOREIGN KEY (agence) REFERENCES agence(agence) ON DELETE CASCADE,
    FOREIGN KEY (type_service) REFERENCES service(service) ON DELETE CASCADE
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