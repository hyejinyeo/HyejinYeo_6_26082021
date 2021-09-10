/* Ce fichier contient la logique de routing uniquement */


// Importer Express
const express = require('express');
// Créer un router
const router = express.Router();
// Importer le controller User
const userCtrl = require('../controllers/user');

/* Sécurité */
// Express-Rate-Limit : limite le taux de la requête d'un utilisateur
const rateLimit = require('express-rate-limit');
// Ne permette pas de créer plus de 3 comptes par heure à partir de la même IP.
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // blockage après 3 requêtes
    message: "Trop de comptes créés à partir de cette adresse IP. Veuillez réessayer après une heure."
});


/* Router pour USER */
// S'inscrire
router.post('/signup', createAccountLimiter, userCtrl.signup);
// Se connecter
router.post('/login', userCtrl.login);


// Exporter le router
module.exports = router;