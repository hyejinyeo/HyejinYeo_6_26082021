// Importer Express
const express = require('express');
// Importer Mongoose
const mongoose = require('mongoose');
// Importer Router User
const userRoutes = require('./routes/user');
// Importer Router Sauce
const sauceRoutes = require('./routes/sauce');
// Chemin
const path = require('path');
// Importer Helmet (aide à sécuriser les applications Express en définissant divers en-têtes HTTP.)
const helmet = require('helmet');



// Créer une application
const app = express();


// Connecter à MongoDB
mongoose.connect('mongodb+srv://HyejinYeo:wls745896@cluster0.zmhar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
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

// Sécurité - helmet
app.use(helmet());

// Dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route User
app.use('/api/auth', userRoutes);
// Route Sauce
app.use('/api/sauces', sauceRoutes);

// Exporter l'application
module.exports = app;