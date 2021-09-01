/* Ce fichier contient la logique de routing uniquement */

// Importer Express
const express = require('express');
// Créer un router
const router = express.Router();
// Importer le controller Sauce
const userCtrl = require('../controllers/user');


/* Router pour USER */
// S'inscrire
router.post('/signup', userCtrl.signup);
// Se connecter
router.post('/login', userCtrl.login);


// Exporter le router
module.exports = router;