// const Server = require('socket.io')
// const http = require('http')
// const express = require('express')


// const app = express();



// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: ['http://localhost:3000'],
//         methods: ['GET', 'POST']
//     }
// })

// io.on('connection', (socket) => {
//     console.log('user connected', socket.id);
//     //socket.on() used to listen the events .can be used both on client and server side.
//     socket.on('disconnect', () => {
//         console.log('user disconnected', socket.id);
//     })
// })


// export { app, io, server }
