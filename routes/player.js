const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');



router.route('/')
  .get(playerController.getAllPlayers)
  .post(playerController.createNewPlayer)
  
router.route('/:id')
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);



router.route('/playlist').get(playerController.getPlayerPlaylist);

router.route('/info').get(playerController.getPlayerById);



module.exports = router;
