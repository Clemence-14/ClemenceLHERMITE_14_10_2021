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
    filename: (req, file, callback) => { // Indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Datenow() comme nom de fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];  // Utilisation de la constante mime type pour résoudre l'extension de fichier appropriée
        callback(null, name + Date.now() + '.' + extension);

    }
});

// Exportation du module multer en lui passant la constante storage et en lui indiquant que l'on ne gère que les dossiers images
module.exports = multer({ storage }).single('image');