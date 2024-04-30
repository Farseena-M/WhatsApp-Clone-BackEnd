const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const handleJoinRoom = require('./controller/room');
const app = express();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const getRecieverSocketId = (reciever) =>{
    return userSocketMap[reciever]
}

const userSocketMap = {}  // {userId : socketId}


io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    handleJoinRoom(socket)
    const userId = socket.handshake.query.userId
    if (userId != 'undefined') userSocketMap[userId] = socket.id



    //io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))


    //socket.on() used to listen the events. Can be used both on the client and server side.
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    });
});

module.exports = { app, io, server,getRecieverSocketId };
