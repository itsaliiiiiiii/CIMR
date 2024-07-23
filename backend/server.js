const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes_affilie = require('./routes_affilie');
const routes_rendezvous = require('./routes_rendezvous');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/cimr', routes_affilie);
app.use('/cimr', routes_rendezvous);


app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});