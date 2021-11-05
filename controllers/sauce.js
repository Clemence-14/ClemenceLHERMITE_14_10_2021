/* Importe le modèle sauce, exporté du document "sauce.js" */
const Sauce = require('../models/sauce');
/* Importe la librairie qui permet de gérer les "Files Systems" */
const fs = require('fs');



/***********
CRUD - Create Read Update Delete
*/


/* Create - Créer une nouvelle sauce dans la base de données */
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //req.protocol: http où https, req.get('host') => localhost:3000
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersdisLiked: [],
	});
	sauce.save()
	.then(() => res.status(201).json({ message: 'La sauce à bien été enregistrée !'}))
	.catch(error => res.status(400).json({ error }));
};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
	.then((sauce) => {
		res.status(200).json(sauce);
	})
	.catch((error) => {
		res.status(404).json({ error });
	});
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
	.then((sauce) => {
		res.status(200).json(sauce);
	})
	.catch((error) => {
		res.status(400).json({ error: error});
	});
};
		

/* Update - Met à jour les informations de la sauce */
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ?
  //soit on change l'image si une nouvelle est fournie soit on modifie juste le corps de la requête
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
	/* Update via "updateOne" pour actualiser la base de données de la sauce concernée */
	Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id } )
	.then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
	.catch(error => res.status(400).json({ error }));
}


/* Delete - Supprime l'objet sauce de la BDD et l'image sauvegardé*/
exports.deleteSauce = (req, res, next) => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
			.catch(error => res.status(400).json({ error }))
		}
	
/*
CRUD - Create Read Update Delete
***********/


//évaluer une sauce (like/dislike);
exports.evaluateSauce = (req, res, next) => {

	if( req.body.like === 0 ){
	  Sauce.findOne({ _id: req.params.id})
	  .then((sauce) => {
		//si l'utilisateur a déjà like la sauce, on enlève le like et on l'enlève des usersLiked
		if(sauce.usersLiked.find(user => user === req.body.userId)){
		  Sauce.updateOne(
			{ _id: req.params.id },
			{
			  $inc: { likes: -1 },
			  $pull: { usersLiked: req.body.userId }
			}
		  )
		  .then(() => { res.status(201).json({ message: "Évaluation prise en compte!" })})
		  .catch(error => { res.status(400).json({ error })
		  });
		}
		//si l'utilisateur a déjà dislike la sauce, on enlève le dislike et on l'enlève des usersDisLiked
		if(sauce.usersDisliked.find(user => user === req.body.userId)){
		  Sauce.updateOne(
			{ _id: req.params.id },
			{
			  $inc: { dislikes: -1 },
			  $pull: { usersDisliked: req.body.userId }
			}
		  )
		  .then(() => { res.status(201).json({ message: "Évaluation prise en compte!" })})
		  .catch(error => { res.status(400).json({ error })
		  });
		}
	  })
	  .catch((error) => {res.status(400).json({ error })});
	}
	//si l'utilisateur n'a pas déjà like la sauce, on rajoute le like et on l'ajoute aux usersLiked
	if( req.body.like === 1 ){
	  Sauce.updateOne(
		{ _id: req.params.id },
		{
		  $inc: { likes: 1 },
		  $push: { usersLiked: req.body.userId }
		}
	  )
	  .then(() => { res.status(201).json({ message: "Évaluation prise en compte!" })})
	  .catch(error => { res.status(400).json({ error })
	  });
	}
	//si l'utilisateur n'a pas déjà dislike la sauce, on rajoute le like et on l'ajoute aux usersdisLiked
	if( req.body.like === -1 ){
	  Sauce.updateOne(
		{ _id: req.params.id },
		{
		  $inc: { dislikes: 1 },
		  $push: { usersDisliked: req.body.userId }
		}
	  )
	  .then(() => { res.status(201).json({ message: "Évaluation prise en compte!" })})
	  .catch(error => { res.status(400).json({ error })
	  });
	}
  }