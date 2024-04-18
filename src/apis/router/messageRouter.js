const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { sendMessage ,getMessages} = require('../controllers/chatController')
const messageRouter = express.Router()

messageRouter.route('/send/:id')
.post(verifyToken,sendMessage)
messageRouter.route('/:id')
.get(verifyToken,getMessages)


module.exports = messageRouter