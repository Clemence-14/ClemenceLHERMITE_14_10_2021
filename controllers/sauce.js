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

		

/* Update - Met à jour une sauce, deux façon, selon si une image est modifié ou non */
exports.modifySauce = (req, res, next) => {

	const userId = req.body.userId;
	const jwtUserId = parseJwt(req.headers.authorization.split(" ")[1]).userId;
	if (userId !== jwtUserId) {
		res.status(403).json({ message: `unauthorized request` })
		return null;
	}

	/* Si un image est modifiée, supprime l'image précédente trouvé via la fonction "findOne" (ID) et supprime l'image*/
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// if (!sauce.imageUrl) {
				fs.unlinkSync(sauce.imageUrl.substring(22))
			// }
		});
	}

	


/* Delete - Supprime l'objet sauce de la BDD et l'image sauvegardé*/
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then((sauce) => {
		const filename = sauce.imageUrl.split('/images/')[1];
		/* On supprime l'image via "fs.unlink" et on utilise la fonction "deleteOne" de mongoose pour supprimer l'objet sauce concernée par l'ID */
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
	.catch(error => res.status(500).json({ error }));
};


/*
CRUD - Create Read Update Delete
***********/


}
