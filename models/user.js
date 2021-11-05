//On importe mongoose
const mongoose = require('mongoose');
//Permet de vérifier qu'une adresse mail ne soit pas utilisée deux fois
const uniqueValidator = require('mongoose-unique-validator');

// On crée un schéma de données qui contient les champs souhaités pour chaque user
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true },
    password : {type : String, required : true }
});

//Ajoute le vérificateur d'email unique au schéma
userSchema.plugin(uniqueValidator);

// On exporte le schéma en tant que modèle mongoose appelé User
// Permet d'appliquer notre structure de données et aussi de simplifier les opérations de lecture et d'écriture dans la bdd
module.exports = mongoose.model('User', userSchema);