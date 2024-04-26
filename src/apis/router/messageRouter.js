const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { sendMessage ,getMessages, UnreadMessageCount} = require('../controllers/chatController')
const messageRouter = express.Router()

messageRouter.route('/send/:id')
.post(verifyToken,sendMessage)
messageRouter.route('/:id')
.get(verifyToken,getMessages)
messageRouter.route('/unread/:id')
.get(verifyToken,UnreadMessageCount)


module.exports = messageRouter