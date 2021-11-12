/* Importe la librairie "bcrypt" afin de hasher les mots de passes et de comparer les mots de passes encodés */
const bcrypt = require('bcrypt');

/* Importer la librairie "jsonwebtoken" pour pouvoir créer et vérifier les tokens d'authentification */
const jwt = require('jsonwebtoken');

/* Importe le modèle user, exporté du document "user.js" */
const User = require('../models/user');


////SIGNUP - Fonction pour créer un utilisateur dans la BDD////

exports.signup = (req, res, next) => {
    /* Hash le mot de passe avant de le stocker */
    bcrypt.hash(req.body.password, 10) // Nombre de fois où l'on fait le tour de l'algorithme
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        /* Sauvegarde l'utilisateur dans la BDD, email et mot de passe (hashé avec Bcrypt)  */
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(() => res.status(400).json({ message: 'Email déjà utilisé !' }));
    })
    .catch(error => res.status(500).json({ error }));
};



/***********
LOGIN - Fonction pour se connecter en tant qu'utilisateur se trouvant dans la BDD et si les logins sont valides
*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        /* Compare le mot de passe entré et celui de la BDD */
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(  // Pour encoder un nouveau token
                    { userId: user._id }, // Id utilisateur
                    // Clé pour l'encodage
                    process.env.JWT_SECRET,
                    //Chaque token durera 24 heures
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};