/* Ce fichier contient la logique de routing uniquement */

// Importer Express
const express = require('express');
// Créer un router
const router = express.Router();
// Importer le controller Sauce
const sauceCtrl = require('../controllers/sauce');


/* Router CRUD pour SAUCE */
// Create
router.post('/', sauceCtrl.createSauce);
// Read
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
// Update
router.put('/:id', sauceCtrl.modifySauce);
// Delete
router.delete('/:id', sauceCtrl.deleteSauce);


// Exporter le router
module.exports = router;