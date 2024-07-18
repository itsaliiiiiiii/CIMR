const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes'); // We'll create this file next

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});