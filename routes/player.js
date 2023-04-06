const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

const verifyJWT = require('../middleware/verifyJWT')



router.route('/')
  .get(verifyJWT, playerController.getAllPlayers)
  .post(verifyJWT, playerController.createNewPlayer)
  
router.route('/:id')
  .patch(verifyJWT, playerController.updatePlayer)
  .delete(verifyJWT, playerController.deletePlayer);



router.route('/playlist').get(playerController.getPlayerPlaylist);

router.route('/info').get(playerController.getPlayerById);



module.exports = router;
