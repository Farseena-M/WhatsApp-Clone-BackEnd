const { v4: uuidV4 } = require('uuid');
const { getOneUser } = require('../../controllers/userController');
const { io } = require('../socket');

const handleJoinRoom = (socket) => {
    const createRoom = () => {
        const roomId = uuidV4()
        socket.emit('room-created', { roomId })
        console.log('User create the room');
    }

    const joinRoom = ({ roomId }) => {
        console.log('User joined the room', roomId);
        socket.join(roomId)
    };

    socket.on('create-room', createRoom)
    socket.on('join-room', joinRoom)

    // Handle WebRTC signaling messages
    socket.on('offer', ({ offer, roomId, caller, reciever }) => {
        const callerDtls = getOneUser(caller)
        const recieverDtls = getOneUser(reciever)
        const data = {
            offer: offer,
            roomId: roomId,
            caller: callerDtls,
            reciever: recieverDtls
        }
        if (io) {
            io.to(roomId).emit('offer', data);
        } else {
            console.error('io is not defined');
        }
    });

    socket.on('answer', ({ roomId, answerer, reciever, answer }) => {
        const answeredUser = getOneUser(answerer)
        const recievedUser = getOneUser(reciever)
        const data = {
            answerer: answeredUser,
            recievedUser: recievedUser,
            answer: answer
        }
        if (io) {
            io.to(roomId).emit('answer', data);
        } else {
            console.error('io is not defined');
        }
    });

    socket.on('ice-candidate', ({ roomId, sender, reciever, candidate }) => {
        const sendedUser = getOneUser(sender)
        const recievedUser = getOneUser(reciever)
        const data = {
            sender: sendedUser,
            reciever: recievedUser,
            candidate: candidate
        }
        if (io) {
            io.to(roomId).emit('ice-candidate', data);
        } else {
            console.error('io is not defined');
        }
    });



};

module.exports = handleJoinRoom;
