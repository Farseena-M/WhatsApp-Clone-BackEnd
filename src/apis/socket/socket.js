const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:['https://whats-app-clone-front-end-seven.vercel.app/']
    }
});


let userSocketMap = []       // [userId : socketId]

const EditData = (data,id,call)=>{
    const newData = data.map(item =>
    item.id === id ? {item, call} : item
   )
    return  newData
  }
    


const getRecieverSocketId = (reciever) => {
    return userSocketMap[reciever]     
}



io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    const userId = socket.handshake.query.userId
    if (userId != 'undefined') userSocketMap[userId] = socket.id
   


    //io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
    
    
    
    // call

    socket.on('calleruser',data=>{
        userSocketMap = EditData(userSocketMap, data.sender, data.recipient)

        const client = userSocketMap.find(user => user.id === data.recipient)
        if(client){
            if(client.call){
                EditData(userSocketMap, data.sender, null)
                socket.emit(data)
            }else{
                EditData(userSocketMap, data.recipient, data.sender)
                socket.to(`${client.socket.id}`).emit('callUserToClient', data)
            }
        }

    })

        
    //socket.on() used to listen the events. Can be used both on the client and server side.
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    });
});


module.exports = { app, io, server, getRecieverSocketId };
