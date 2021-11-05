//Multer permet de gérer les fichiers entrants dans les requêtes http
const multer = require('multer');

//Dictionnaire qui permet de gérer les extensions des images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration qui contient la logique à indiquer à multer et où enregistrer les fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') // Images qui s'enregistrent dans le dossier images
    },
    filename: (req, file, callback) => { // Indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouterun timestamp Datenow() comme nom de fichier
        const name = file.originalname.split('').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);

    }
});

module.exports = multer({ storage }).single('image');