const express = require('express');

const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
require('dotenv').config();
//***************************************************************************** */
//...........................  MONGOOSE .................................
//***************************************************************************** */
mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//***************************************************************************** */
//.............................  APP .................................
//***************************************************************************** */
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

 app.use(express.json());
 app.use('/api/sauces', saucesRoutes);
 app.use('/api/auth', userRoutes)
 app.use('/images', express.static(path.join(__dirname, 'images')));
 // indique à Express qu'il faut gérer la ressource images de manière statique 
 //(un sous-répertoire de notre répertoire de base, __dirname)
 // à chaque fois qu'elle reçoit une requête vers la route /images
 
module.exports = app;