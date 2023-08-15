const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
    color: { type: String, required: true },
    pointsSections: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        howToScore: { type: String, required: true },
        used: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
        diceUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Die' }],
        bonus: { type: Number, default: 0 },
        isUpperPoints: { type: Boolean, required: true },
        acceptedDie: { type: Number, required: true },
        isSelected: { type: Boolean, default: false, required: true },
    }],
    rollsLeftThisRound: { type: Number, required: true },
    scoreTotals: {
        upperSectionTotal: Number,
        upperSectionBonus: Number,
        upperSectionTotalWithBonus: Number,
        lowerSectionTotal: Number,
        grandTotal: Number
    },
    socketId: { type: String, required: true }
});

module.exports = mongoose.model('Player', playerSchema);
