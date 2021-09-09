/* Ce fichier contient la logique de routing uniquement */


// Importer Express
const express = require('express');
// Créer un router
const router = express.Router();
// Importer le controller Sauce
const sauceCtrl = require('../controllers/sauce');
// Importer la validator du toekn : Authentification
const auth = require('../middleware/auth')
// Importer le middleware multer
const multer = require('../middleware/multer-config');

/* Sécurité */
// Express-Rate-Limit : limite le taux de la requête d'un utilisateur
const rateLimit = require('express-rate-limit');
// Ne permette pas d'enregistrer plus de 50 sauces par 15 minutes à partir de la même IP.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // blockage après 50 requêtes
    message: "Trop de requêtes envoyées à partir de cette adresse IP. Veuillez réessayer après 15 minutes."
});


/* Router pour SAUCE */
// CRUD
// Create
router.post('/', auth, apiLimiter, multer, sauceCtrl.createSauce);
// Read
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Update
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Delete
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Like or Dislike
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce);


// Exporter le router
module.exports = router;