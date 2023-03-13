const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.route('/playlist').get(playerController.getPlayerPlaylist);

router.route('/')
  .get(playerController.getAllPlayers)
  .post(playerController.createNewPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);


  router.route('/info').get(playerController.getPlayerById);



module.exports = router;
