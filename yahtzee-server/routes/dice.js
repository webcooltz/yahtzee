const express = require('express');
const router = express.Router();
const diceController = require('../controllers/dice');

router.get('/:id', diceController.getDice);
router.put('/:id/roll', diceController.rollDice);
router.post('/:id/reset', diceController.resetDice);

module.exports = router;