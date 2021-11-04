const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoute = require('./routes/sauce');
const userRoutes = require('./routes/user');

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
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//app.use(bodyParser.json());  //deprecated
app.use(express.json());    //Remplace bodyParser
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoute);

app.put('/api/sauces/:id', (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
});


module.exports = app;