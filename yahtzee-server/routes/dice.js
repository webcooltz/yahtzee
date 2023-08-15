const express = require('express');
const router = express.Router();
const diceController = require('../controllers/dice');

router.get('/', diceController.getDice);
router.put('/roll', diceController.rollDice);
router.post('/reset', diceController.resetDice);

module.exports = router;