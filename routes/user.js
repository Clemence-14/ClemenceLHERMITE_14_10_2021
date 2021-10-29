const express = require('express');

//La fonction router
const router = express.Router();

const userCtrl = require('../controllers/user');

//La route (endpoint) signup
router.post('/signup', userCtrl.signup);
//La route login
router.post('/login', userCtrl.login);

//Exportation du module
module.exports = router;