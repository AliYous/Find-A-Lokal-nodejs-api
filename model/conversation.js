const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    local_id: {
        type: String,
        required: true,
    },
    messages: [{
        sender_id: String, // user_id of the sender
        receiver_id: String, // user_id of the receiver
        content: String // content of the message
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);