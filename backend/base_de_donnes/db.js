const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CIMR',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const connection = mysql.createPool(dbConfig);

async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Erreur connection avec base de donnes', error);
        throw error;
    }
}

module.exports = {
    getConnection,
    connection
};