const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController')


router.route('/')
    .get(messageController.getAllMessages)  
    .post(messageController.createNewMessage)
    .patch(messageController.updateMessage)
    

router.route('/:id')
   
    .delete(messageController.deleteMessage)
    .patch(messageController.updateMessagePosition)  

module.exports = router;
