/*--------------------------------------- ENTRY APPLICATION : EXPRESS ---------------------------------------*/

// Importer Express : Framework node.js
const express = require('express');
// Importer Mongoose : Utilisation de la base de données Mongo DB
const mongoose = require('mongoose');
// Donner un access au chemin 
const path = require('path');


/* Sécurité */
// Helmet : aide à sécuriser les applications Express en définissant divers en-têtes HTTP
const helmet = require('helmet');
// Dotenv : aide à masquer les informations de connexion à la base de données - variables d'environnement
require('dotenv').config();
// Nocache : désactive la mise en cache du navigateur
const nocache = require('nocache');
// Cookie-session : contrôle les cookies et les expire après la durée définie.
const session = require('cookie-session');

/* Déclaration des routes */
// User
const userRoutes = require('./routes/user');
// Sauce
const sauceRoutes = require('./routes/sauce');


/* Création d'une application Express */
const app = express();


/* Connection à la base de données MongoDB */
mongoose
    .connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware Header pour la sécurité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Analyser le corps de la requête --> !!! Si cela ne fonctionne pas, il faut installer "body-parser" P1 C6 !!!
app.use(express.json());

/* Sécurité */
app.use(helmet());
app.use(nocache());
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 heure
app.use(session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: { 
        secure: true,                      // le cookie doit être envoyé uniquement via HTTPS
        httpOnly: true,                    // le cookie doit uniquement être envoyé via HTTP(S) et n'est pas mis à la disposition du client JavaScript
        domain: 'http://localhost:3000',   // le domaine du cookie
        expires: expiryDate                // la date d'expiration du cookie
    }
}));

// Utilisation du dossier images 
// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images .
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route User (Déclaration des routes: ligne 21-25)
app.use('/api/auth', userRoutes);
// Route Sauce
app.use('/api/sauces', sauceRoutes);


/* Exporter l'application Express */
module.exports = app;