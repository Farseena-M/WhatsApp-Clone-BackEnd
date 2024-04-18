const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const globalErrorHandler = require('././apis/controllers/errorController')
const userRouter = require('././apis/router/userRouter');
const authRouter = require('./apis/router/authRouter');
const messageRouter = require('./apis/router/messageRouter');
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))



app.use('/users/auth', authRouter)
app.use('/users', userRouter)
app.use('/users/messages',messageRouter)



app.all('*', (req, res) => {
   return res.status(404).json({ message: `can't find ${req.originalUrl} on the server!` })
})

app.use(globalErrorHandler)

module.exports = app