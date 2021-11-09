const express = require('express');
//Création d'un router avec la méthode router d'express
const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // Importation middleware

const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Pour le like
router.post('/:id/like', auth, sauceCtrl.evaluateSauce);

module.exports = router;