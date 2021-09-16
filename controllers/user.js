/* Ce fichier contient la logique métier uniquement */

// Importer bcrypt pour hachage
const bcrypt = require('bcrypt');
// Importer json webtoken
const jwt = require('jsonwebtoken'); 
// Importer le modèle User
const User = require('../models/User');

/* Sécurité */
// Password-validator : 
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(7)                                    
.is().max(20)                                   
.has().uppercase()                              
.has().lowercase()                              
.has().digits(1)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123', 'motdepasse1', 'motdepasse123']); 


/* Controller pour USER */
// S'inscrire
exports.signup = (req, res, next) => {
    // Si le mot de passe est valide
    if (passwordSchema.validate(req.body.password)) {
        // Crypter le mot de passe (hachage de 10 tours = même effet de l'ajout de sel)
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Créer un nouvel utilisateur
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Ajouter l'utilisateur à la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
    // Si le mot de passe n'est pas valide 
    else {
        return res.status(400).json({ message: `
            Format de mot de passe incorrect !
            Le mot de passe :
            - doit être d'une longueur minimale de 7
            - doit être d'une longueur maximale de 20
            - doit contenir un/des majuscule(s)
            - doit contenir un/des minuscule(s)
            - doit contenir au moins 1 chiffre
            - ne doit pas contenir d'espace
        ` });
    } 
};


// Se connecter
exports.login = (req, res, next) => {
    // Chercher l'utilisateur dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'est pas trouvé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Si l'utilisateur est trouvé: Comparer le mot de passe avec celui enregistré dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe n'est pas valide
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si le mot de passe est valide: Envoyer l'userId et un token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};