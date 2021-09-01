// Importer Express
const express = require('express');
// Importer Mongoose
const mongoose = require('mongoose');

// Créer un application
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

// Middleware CRUD
// Create
app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({ message: 'Object created !'});
});
// Read
app.get('/api/sauces', (req, res, next) => {
    const sauce = [
        {
            name: 'Nom de la sauce',
            manufacturer: 'Fabricant de la sauce',
            description: 'Description de la sauce',
            mainPepper: 'Le principal ingrédient épicé de la sauce',
            imageUrl: '',
            heat: 1,
            likes: 2,
            dislikes: 1,
            userLiked: ['string <userId>'],
            userDisliked: ['string <userId'],
        },
        {
            name: 'Nom de la sauce',
            manufacturer: 'Fabricant de la sauce',
            description: 'Description de la sauce',
            mainPepper: 'Le principal ingrédient épicé de la sauce',
            imageUrl: '',
            heat: 1,
            likes: 2,
            dislikes: 1,
            userLiked: ['string <userId>'],
            userDisliked: ['string <userId'],
        }
    ];
    res.status(200).json(sauce);
});
// Update
// Delete


// Exporter l'application
module.exports = app;