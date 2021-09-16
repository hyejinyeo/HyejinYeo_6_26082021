// Importer multer
const multer = require('multer');

// Dictionnaire du Mime Types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
       callback(null, 'images') 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exporter le middleware
module.exports = multer({ storage }).single('image');