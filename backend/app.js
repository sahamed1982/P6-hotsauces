const express = require('express');
const helmet = require("helmet");
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

app.use(helmet()); //Helmet helps you secure your Express apps by setting various HTTP headers.

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
 
module.exports = app;