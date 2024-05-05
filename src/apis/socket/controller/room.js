const { v4: uuidV4 } = require('uuid');
const { getOneUser } = require('../../controllers/userController');
const { io } = require('../socket');

const handleJoinRoom = (socket) => {
    const createRoom = () => {
        const roomId = uuidV4();
        socket.emit('room-created', { roomId });
        console.log('User created the room');
    };

    const joinRoom = ({ roomId }) => {
        console.log('User joined the room', roomId);
        socket.join(roomId);
    };

    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);

    // Handle WebRTC signaling messages
    socket.on('offer', ({ offer, roomId, caller, receiver }) => {
        const callerDetails = getOneUser(caller);
        const receiverDetails = getOneUser(receiver);
        const data = {
            offer: offer,
            roomId: roomId,
            caller: callerDetails,
            receiver: receiverDetails
        };
        if (io) {
            io.to(roomId).emit('offer', data);
        } else {
            console.error('io is not defined');
        }
    });

    socket.on('answer', ({ roomId, answerer, receiver, answer }) => {
        const answeredUser = getOneUser(answerer);
        const receivedUser = getOneUser(receiver);
        const data = {
            answerer: answeredUser,
            receiver: receivedUser,
            answer: answer
        };
        if (io) {
            io.to(roomId).emit('answer', data);
        } else {
            console.error('io is not defined');
        }
    });

    socket.on('ice-candidate', ({ roomId, sender, receiver, candidate }) => {
        const senderUser = getOneUser(sender);
        const receiverUser = getOneUser(receiver);
        const data = {
            sender: senderUser,
            receiver: receiverUser,
            candidate: candidate
        };
        if (io) {
            io.to(roomId).emit('ice-candidate', data);
        } else {
            console.error('io is not defined');
        }
    });

    // Handle invitation, acceptance, and rejection
    socket.on('send-invitation', ({ invitationSender, invitationReceiver }) => {
        const sender = getOneUser(invitationSender);
        const receiver = getOneUser(invitationReceiver);
        const data = {
            invitationSender: sender,
            invitationReceiver: receiver
        };
        // Emit invitation event to the receiver
        io.to(invitationReceiver).emit('invitation', data);
    });

    socket.on('accept-invitation', ({ answerer, receiver }) => {
        const inviteAnswerer = getOneUser(answerer);
        const answerReceiver = getOneUser(receiver);
        const data = {
            inviteAnswerer,
            answerReceiver
        };
        // Notify both parties that the invitation was accepted
        io.to(receiver).emit('invitation-accepted', data);
    });

    socket.on('reject-invitation', ({ rejecter, receiver }) => {
        const inviteRejecter = getOneUser(rejecter);
        const rejectReceiver = getOneUser(receiver);
        const data = {
            inviteRejecter,
            rejectReceiver
        };
        // Notify the caller that the invitation was rejected
        io.to(receiver).emit('invitation-rejected', data);
    });
};

module.exports = handleJoinRoom;
