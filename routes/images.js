const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')

router.route('/')
    .get(imageController)
    .post(imageController)
    .patch(imageController)
    .delete(imageController)


module.exports = router