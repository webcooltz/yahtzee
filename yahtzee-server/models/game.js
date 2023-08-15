// game model
const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    currentRoundNumber: { type: Number, required: true },
    gameFinished: { type: Boolean, default: false },
    dice: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Die' }],
    currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
});

module.exports = mongoose.model('Game', gameSchema);
