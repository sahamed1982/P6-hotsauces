const Sauce = require("../models/Sauce");
const fs = require("fs");

//***************************************************************************** */
//.......................  Aficher toutes les sauces .................................
//***************************************************************************** */

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//***************************************************************************** */
//.......................  afficher une sauce .................................
//***************************************************************************** */

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//***************************************************************************** */
//.......................  Creer une sauce .................................
//***************************************************************************** */

// exports.createThing = (req, res, next) => {
//   delete req.body._id;
//   const thing = new Thing({
//     ...req.body,
//   });
//   thing
//     .save()
//     .then(() => res.status(201).json({ message: "Objet enregistré !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauces enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//***************************************************************************** */
//.......................  Modifier une sauce .................................
//***************************************************************************** */

// exports.modifyThing = (req, res, next) => {
//   Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: "Modified!" }))
//     .catch((error) => res.status(400).json({ error }));
// };

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//***************************************************************************** */
//.......................  Supprimer une sauce .................................
//***************************************************************************** */

// exports.deletThing = (req, res, next) => {
//   Thing.deleteOne({ _id: req.params.id })
//     .then(() => res.status(200).json({ message: "objet supprimé !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé !" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
//***************************************************************************** */
//.......................  LIKE ou DISLIKE une sauce ...........................
//***************************************************************************** */

exports.likeOrNotSauce =(req, res, next) =>{
  Sauce.findOne( {_id : req.params.id})
    .then(sauce => { 
      let like =req.body.like
      let userId = req.body.userId
      // nouvelles valeurs à modifier
      const newValues = {
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
          likes: 0,
          dislikes: 0,
      }
      // Différents cas:
      switch (like) {
          case 1:  // CAS: sauce liked
              newValues.usersLiked.push(userId);
              break;
          case -1:  // CAS: sauce disliked
              newValues.usersDisliked.push(userId);
              break;
          case 0:  // CAS: Annulation du like/dislike  et on retire id du tableau
              if (newValues.usersLiked.includes(userId)) {
                  // si on annule le like
                  const index = newValues.usersLiked.indexOf(userId);
                  newValues.usersLiked.splice(index, 1);
              } else {
                  // si on annule le dislike
                  const index = newValues.usersDisliked.indexOf(userId);
                  newValues.usersDisliked.splice(index, 1);
              }
              break;
      };
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: req.params.id }, newValues )
          .then(() => res.status(200).json({ message: 'Sauce évaluée !' }))

    })
    .catch(error => res.status(500).json({error}));
};



