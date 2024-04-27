const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Conversation = require('../model/conversationSchema');
const Message = require('../model/messageSchema');
const { getRecieverSocketId } = require('../socket/socket');

const sendMessage = asyncErrorHandler(async (req, res) => {
    try {
        const message = req.body.message;
        const reciever = req.params.id;
        const sender = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, reciever] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, reciever]
            });
        }

        const newMessage = new Message({
            sender,
            reciever,
            message,
            createdAt: new Date()
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        //This will run in parallel
        Promise.all([conversation.save(), newMessage.save()])

        //Socket function

        const recieverSocketId = getRecieverSocketId(reciever)
        if (recieverSocketId) {
            //io.to (<socket._id>).emit() used to send events to specific client
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json(newMessage);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


const getMessages = asyncErrorHandler(async (req, res) => {
    try {
        const userToChatId = req.params.id
        const sender = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [sender, userToChatId] }
        }).populate('messages')
        if (!conversation) return res.status(200).json([])

        const messages = conversation.messages
        return res.status(200).json(messages)

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})


const UnreadMessageCount = asyncErrorHandler(async (req, res) => {
    try {
        const unReadMessages = await Message.countDocuments({
            reciever: req.params.userId,
            isRead: false
        });
        console.log(unReadMessages);
        res.json({ unReadCount: unReadMessages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = {
    sendMessage,
    getMessages,
    UnreadMessageCount
};
