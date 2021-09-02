/* Ce fichier contient la logique métier uniquement */

// Importer le modèle Sauce
const Sauce = require('../models/Sauce');
// Importer file system
const fs = require('fs');


/* Controller CRUD pour SAUCE */

// Create : Créer 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Une sauce nouvellement enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Read : Lire
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

// Update : Mettre à jour
exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    // Si la modification contient une nouvelle image, supprime l'ancienne du serveur et ajoute la nouvelle
    req.file ? (
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlinkSync(`images/${filename}`)
            }),
            sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
    // Sinon, applique la modification
    ) : (sauceObject = { ...req.body })
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Delete : Supprimer
exports.deleteSauce = (req, res, next) => {
    // Chercher la sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Extraire le nom du fichier d'image
            const filename = sauce.imageUrl.split('/images/')[1];
            // Supprimer l'image du dossier 'images'
            fs.unlink(`images/${filename}`, () => {
                // Supprimer la sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));  
};