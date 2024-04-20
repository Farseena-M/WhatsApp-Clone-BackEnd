const express = require('express')
const userAuthController = require('../controllers/userAuthController')
const uploadImage = require('../middlewares/multer')
const authRouter = express.Router()

authRouter.post('/signup',uploadImage,(userAuthController.SignUp))
.post('/login',(userAuthController.Login))



module.exports = authRouter