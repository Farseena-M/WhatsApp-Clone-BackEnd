const express = require('express')
const userAuthController = require('../controllers/userAuthController')
const uploadImage = require('../middlewares/multer')
const authRouter = express.Router()

authRouter.post('/signup',uploadImage,(userAuthController.SignUp))
.post('/login',(userAuthController.Login))
.post('/logout',(userAuthController.Logout))



module.exports = authRouter