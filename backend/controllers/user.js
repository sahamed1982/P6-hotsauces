
const bcrypt = require("bcrypt");//npm install --save bcrypt et on le require
const User = require("../models/User"); //importation du modele User pour s'en servir
const jwt = require("jsonwebtoken");


//***************************************************************************** */
//.......................  middleware SIGNUP .................................
//***************************************************************************** */


exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //  hash du mot de passe , 10 = 10 tours d'algorythme
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user                   // Ajout de l'utilisateur à la base de données.
        .save()
        .then(() => res.status(201).json({ message: "utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//***************************************************************************** */
//.......................  Middleware LOGIN .................................
//***************************************************************************** */
 

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(403)
          .json({ message: "403: unauthorized request." });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(403).json({ message: "403: unauthorized request." });
            } else {
              res.status(200).json({
                userId: user._id,
                //token:'TOKEN'
                 token: jwt.sign(
                     {userId : user._id},
                     'RANDOM_TOKEN_SECRET', // chaîne secrète de développement temporaire
                     { expiresIn:'24h'} // définit la durée de validité du token à 24 heures.
                                          //  L'utilisateur devra donc se reconnecter au bout de 24 heures.
                 )
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
