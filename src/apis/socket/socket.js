const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});


let userSocketMap = []


const getRecieverSocketId = (reciever) => {
    return userSocketMap[reciever]
}



io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    const userId = socket.handshake.query.userId
    if (userId != 'undefined') userSocketMap[userId] = socket.id


    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))



    // VideoCall Signaling

    socket.on('sendOffer', ({ offer, receiverId }) => {
        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveOffer', {
                offer,
                senderId: userId, 
            });
        }
    });

    socket.on('sendAnswer', ({ answer, senderId }) => {
        io.to(senderId).emit('receiveAnswer', {
            answer,
            receiverId: userId, 
        });
    });


    socket.on('sendIceCandidate', ({ candidate, receiverId }) => {
        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveIceCandidate', {
                candidate,
                senderId: userId, 
            });
        }
    });




    // socket.on() used to listen the events.
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    });
});


module.exports = { app, io, server, getRecieverSocketId };
