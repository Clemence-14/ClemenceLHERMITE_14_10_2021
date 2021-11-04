/* Importe le modèle sauce, exporté du document "sauce.js" */
const Sauce = require('../models/sauce');
/* Importe la librairie qui permet de gérer les "Files Systems" */
const fs = require('fs');



/***********
CRUD - Create Read Update Delete
*/


/* Create - Créer l'objet sauce dans la BDD */
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersdisLiked: [],
	});
	sauce.save()
	.then(() => res.status(201).json({ message: 'La sauce à bien été enregistrée !'}))
	.catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
	.then((sauce) => {
		res.status(200).json(sauce);
	})
	.catch((error) => {
		res.status(404).json({ error });
	});
};


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
	/* Update via "updateOne" pour actualisé la BDD de la sauce concernée */
	Sauce.updateOne( { _id: req.params.id }, { ...req.body, _id: req.params.id } )
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


