/* const { v4: uuidV4 } = require('uuid');
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

    socket.on('offer', async ({ offer, roomId, caller, receiver }) => {
        const callerDetails = await getOneUser(caller);
        const receiverDetails = await getOneUser(receiver);
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

    socket.on('answer', async ({ roomId, answerer, receiver, answer }) => {
        const answeredUser = await getOneUser(answerer);
        const receivedUser = await getOneUser(receiver);
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

    socket.on('ice-candidate', async ({ roomId, sender, receiver, candidate }) => {
        const senderUser = await getOneUser(sender);
        const receiverUser = await getOneUser(receiver);
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

    socket.on('send-invitation', async ({ invitationSender, invitationReceiver }) => {
        const sender = await getOneUser(invitationSender);
        const receiver = await getOneUser(invitationReceiver);
        const data = {
            invitationSender: sender,
            invitationReceiver: receiver
        };
        io.to(invitationReceiver).emit('invitation', data);
    });

    socket.on('accept-invitation', async ({ answerer, receiver }) => {
        const inviteAnswerer = await getOneUser(answerer);
        const answerReceiver = await getOneUser(receiver);
        const data = {
            inviteAnswerer,
            answerReceiver
        };
        io.to(receiver).emit('invitation-accepted', data);
    });

    socket.on('reject-invitation', async ({ rejecter, receiver }) => {
        const inviteRejecter = await getOneUser(rejecter);
        const rejectReceiver = await getOneUser(receiver);
        const data = {
            inviteRejecter,
            rejectReceiver
        };
        io.to(receiver).emit('invitation-rejected', data);
    });
};

module.exports = handleJoinRoom;
 */