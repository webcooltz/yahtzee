/* lobby model
// - Before game starts, users are in the lobby
// Use cases:
// - when users connect, add them to the database/lobby
// - when users disconnect, remove them from the database/lobby
*/
const mongoose = require('mongoose');

const lobbySchema = mongoose.Schema({
    code: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
});

module.exports = mongoose.model('Lobby', lobbySchema, 'lobbies');
