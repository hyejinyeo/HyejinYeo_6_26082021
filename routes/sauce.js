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



/* Router pour SAUCE - CRUD */
// Create
router.post('/', auth, multer, sauceCtrl.createSauce);
// Read
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Update
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Delete
router.delete('/:id', auth, sauceCtrl.deleteSauce);


// Exporter le router
module.exports = router;