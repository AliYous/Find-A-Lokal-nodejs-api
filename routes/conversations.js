const router = require('express').Router();
const Conversation = require('../model/conversation');



// Get all conversations for a particular user, need to add a verify middleware to make sure only the authorized user can get this data
router.get('/:user_id', async (req, res) => {
    const conversations = await Conversation.find();
    res.json(conversations = await Conversation.find());
});

// Create convo
// will be use mainly on first message sent (when user clicks contact local)
// the request body will contain the local_id and messageContent, we have the user_id from the req params.
// Create a new convo with the initial message
router.post('/')

// Update an existing convo to add a new message
router.put('/:conversation_id/:sender_id/:receiver_id', async (req, res) => {
    //créer le message, trouver la conversation dans la db, push le message dans la conversation et update la conversation avec la updatedConv

});

module.exports = router