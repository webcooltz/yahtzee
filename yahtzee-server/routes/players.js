const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player');

router.get('/', playerController.getPlayers);
// router.get('/:id', playerController.getPlayer);
// router.post('/', playerController.addPlayer);
router.put('/:id', playerController.updatePlayer);
router.put('/', playerController.resetAllPlayerData);
router.delete('/:id', playerController.removePlayer);
router.delete('/', playerController.removeAllPlayers);

module.exports = router;