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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
    // Si la modification contient une nouvelle image, supprime l'ancienne d'abord, puis ajoute la nouvelle
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
    // Sinon, applique la modification du corps de la requête
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

// Like or Dislike
exports.likeOrDislikeSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId
    let sauceId = req.params.id;

    switch (like) {
        // Si l'utilisateur clique sur le bouton "Like"
        case 1:
            Sauce.updateOne({ _id: sauceId }, { $push:{ usersLiked: userId }, $inc:{ likes: +1 } })
                .then(()=> res.status(200).json({ message: 'Like ajouté !'}))
                .catch(error => res.status(400).json({ error }))
            break;
        // Si l'utilisateur clique sur le bouton "Dislike"
        case -1:
            Sauce.updateOne({ _id: sauceId }, { $push:{ usersDisliked: userId }, $inc:{ dislikes: +1 } })
                .then(()=> res.status(200).json({ message: 'Dislike ajouté !'}))
                .catch(error => res.status(400).json({ error }))
            break;
        // Si l'utilisateur annule leur avis en cliquant encore 1 fois - neutre
        case 0:
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    // Annuler Like
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull:{ usersLiked: userId }, $inc:{ likes: -1 } })
                            .then(()=> res.status(200).json({ message: 'Like annulé !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    // Annuler Dislike
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull:{ usersDisliked: userId }, $inc:{ dislikes: -1 } })
                            .then(()=> res.status(200).json({ message: 'Dislike annulé !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(400).json({ error }))
            break;
        default: console.log(error);
    }
};