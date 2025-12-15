const dbConfig = {
    host: 'localhost',      // Docker container hostname
    port: 3306,            // Default MySQL port
    user: 'root',          // Database username
    password: '',          // Database password (empty for development)
    database: 'CIMR',      // Database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = dbConfig;