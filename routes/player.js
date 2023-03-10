const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController')

router.route('/')
    .get(playerController.getAllPlayers)
    .post(playerController.createNewPlayer)
    .patch(playerController.updatePlayer)
    .delete(playerController.deletePlayer)


module.exports = router