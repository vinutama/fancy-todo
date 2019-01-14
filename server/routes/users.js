var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var Auth = require('../middlewares/index')

/*User sign up */
router.post('/', userController.signUp)

/*User sign in*/
router.post('/login', userController.signIn)

/*User Google Sign In */
router.post('/googleLogin', Auth.googleLogin, userController.googleSignIn)

/*find all users*/
router.use(Auth.isLogin)
router.get('/:projectId', userController.findAll)

module.exports = router;
