var express = require('express');
var router = express.Router();
var userController = require('../Controllers/UserController')

router.get('/', userController.get_users)

router.post('/find', userController.find)

router.post('/logIn', userController.userLogIn)

router.post('/register', userController.userRegister)

router.get('/get-top-solvers', userController.getTopSolvers)

module.exports = router;




