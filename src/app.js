const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const globalErrorHandler = require('././apis/controllers/errorController')
const userRouter = require('././apis/router/userRouter');
const authRouter = require('./apis/router/authRouter');
const messageRouter = require('./apis/router/messageRouter');
const { app } = require('./apis/socket/socket');


// const app = express();

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())



app.use('/users/auth', authRouter)
app.use('/users', userRouter)
app.use('/users/messages', messageRouter)



app.all('*', (req, res) => {
   return res.status(404).json({ message: `can't find ${req.originalUrl} on the server!` })
})

app.use(globalErrorHandler)

module.exports = app