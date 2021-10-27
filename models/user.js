//On importe mongoose
const mongoose = require('mongoose');
//Permet de vérifier qu'une adresse mail ne soit pas utilisée deux fois
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true },
    password : {type : String, required : true }
});

//Ajoute le vérificateur d'email unqiue au schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);