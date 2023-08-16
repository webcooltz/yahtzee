// student model
const mongoose = require('mongoose');

const diceSchema = mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    currentDice: [
        {
            id: { type: Number, required: true },
            currentNumber: { type: Number, required: true, default: 0 },
            isSelected: { type: Boolean, required: true, default: false }
        },
    ]
});

module.exports = mongoose.model('Dice', diceSchema, 'dice');