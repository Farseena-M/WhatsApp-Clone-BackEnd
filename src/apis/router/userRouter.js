const express = require('express')
const { getUsers, getOneUser, updateUser, deleteUser } = require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken')
const userRouter = express.Router()


userRouter.route('/all')
    .get(verifyToken, getUsers)
userRouter.route('/:id')
    .get(verifyToken, getOneUser)
userRouter.route('/:id')
    .patch(verifyToken, updateUser)
userRouter.route('/:id')
    .delete(verifyToken, deleteUser)


module.exports = userRouter