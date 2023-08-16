const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

router.get('/:id', gameController.getGame); // getGame()
router.post('/', gameController.createGame); // newGame()
router.put('/:id', gameController.updateGame); // updateGame()
router.put('/:id/reset', gameController.resetGameData); // resetGame()
router.delete('/:id', gameController.deleteGame); // exitGame()

module.exports = router;