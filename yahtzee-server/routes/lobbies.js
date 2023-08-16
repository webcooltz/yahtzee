const express = require('express');
const router = express.Router();
const lobbyController = require('../controllers/lobby');

router.post('/', lobbyController.newLobby);
router.put('/:code/join', lobbyController.joinLobby);
router.put('/:code/leave', lobbyController.leaveLobby);
router.delete('/:code', lobbyController.deleteLobby);

module.exports = router;