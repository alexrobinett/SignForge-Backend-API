const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController')


router.route('/')
    .get(messageController.getAllMessagesFromPlayer)
    .post(messageController.createNewMessage)
    .patch(messageController.updateMessage)
    .delete(messageController.deleteMessage)
    




module.exports = router;
