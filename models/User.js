// Importer Mongoose
const mongoose = require('mongoose');
// Importer mongoose-unique-validator : unique email 
const uniqueValidator = require('mongoose-unique-validator');

// Schema User
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Ajouter plugin d'unique validator
userSchema.plugin(uniqueValidator);
// Exporter le schema
module.exports = mongoose.model('User', userSchema);