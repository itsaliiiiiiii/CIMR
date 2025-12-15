const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'CIMR',
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