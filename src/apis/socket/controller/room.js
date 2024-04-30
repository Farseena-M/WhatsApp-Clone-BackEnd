const {v4:uuidV4} = require('uuid')

const handleJoinRoom = (socket) => {

    const createRoom = () => {
        const roomId = uuidV4()
        socket.emit('room-created',{roomId})
        console.log('User create the room');
    }

    const joinRoom = ({roomId}) => {
        console.log('User joined the room',roomId);
        socket.join(roomId)
    };

    socket.on('create-room', createRoom)
    socket.on('join-room', joinRoom)

};

module.exports = handleJoinRoom;