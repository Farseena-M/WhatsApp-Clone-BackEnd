const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    isRead:{
        type:Boolean,
        default:true
    }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)
module.exports = Message