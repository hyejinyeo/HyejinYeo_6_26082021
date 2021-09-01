/* Validation du token */

// Importer json webtoken
const jwt = require('jsonwebtoken'); 

// Exporter le middleware
module.exports = (req, res, next) => {
    try {
        // Récupérer le token dans le headers d'authorization
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupérer l'userId
        const userId = decodedToken.userId;
        // Comparer l'userId du token et de la requête
        // Si l'userId n'est pas valable
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } 
        // Si l'userId est valable : Passer au prochain middleware
        else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};