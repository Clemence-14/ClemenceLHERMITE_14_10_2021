const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//const sauceRoute = require('./routes/sauce')
//const userRoutes = require('./routes/user');

const app = express();

//Connection à mongoDB
mongoose.connect('mongodb+srv://Project6-TheHottestReviews:ad7yC94NkExR43oA@cluster0.ztcle.mongodb.net/Base1?retryWrites=true&w=majority',

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

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/api/auth', userRoutes);
//app.use('/api/sauce', sauceRoute);



module.exports = app;