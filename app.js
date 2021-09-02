// Importer Express : Framework node.js
const express = require('express');
// Importer Mongoose : Utilisation de la base de données Mongo DB
const mongoose = require('mongoose');
// Importer Router User
const userRoutes = require('./routes/user');
// Importer Router Sauce
const sauceRoutes = require('./routes/sauce');
// Chemin
const path = require('path');
// Importer Helmet 
const helmet = require('helmet');
// Sécurité - dotenv (aide à masquer les informations de connexion à la base de données - variables d'environnement) 
require('dotenv').config();


// Créer une application
const app = express();


// Connecter à MongoDB
mongoose
  .connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Analyser le corps de la requête --> !!! Si cela ne fonctionne pas, il faut installer "body-parser" P1 C6 !!!
app.use(express.json());

// Sécurité - helmet (aide à sécuriser les applications Express en définissant divers en-têtes HTTP.)
app.use(helmet());


// Dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route User
app.use('/api/auth', userRoutes);
// Route Sauce
app.use('/api/sauces', sauceRoutes);


// Exporter l'application Express 
module.exports = app;