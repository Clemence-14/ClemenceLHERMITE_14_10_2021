const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Indique comment traiter les requêtes

const sauceRoute = require('./routes/sauce');
const userRoutes = require('./routes/user'); // Importation du router

const app = express();

const dotenv = require('dotenv');
const result = dotenv.config();

//Connection à mongoDB
mongoose.connect(`mongodb+srv://${process.env.APP_USERNAME}:${process.env.APP_PASSWORD}@cluster0.ztcle.mongodb.net/${process.env.APP_NAME}?retryWrites=true&w=majority`,

  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
//CORS
// Permet de d'accéder à notre api depuis n'importe quelle origine (*)
// Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'api (Origin, X-Requested-With...)
// Permet d'envoyer des requêtes avec les méthodes mentionnées (get, post...)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//app.use(bodyParser.json());  //deprecated
app.use(express.json());    //Remplace bodyParser
app.use('/images', express.static(path.join(__dirname, 'images'))); // Indique à express qu'il faut gérer la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/api/auth', userRoutes); // On enregistre le routeur pour toutes les demandes effectuées vers api/auth
app.use('/api/sauces', sauceRoute);



module.exports = app;