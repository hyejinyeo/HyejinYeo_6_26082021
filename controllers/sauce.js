/* Ce fichier contient la logique métier uniquement */

// Importer le modèle Sauce
const Sauce = require('../models/Sauce');

/* Controller CRUD pour SAUCE */
// Create
exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Une sauce nouvellement enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};
// Read
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
// Update
exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};
// Delete
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce supprimée !' }))
        .catch(error => res.status(400).json({ error }));
};