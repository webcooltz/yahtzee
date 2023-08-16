const Game = require('../models/game');
const diceController = require('./dice');
const playerController = require('./player');

/* getGame():
// - Retrieve the game data from the DB
// - Return the game
*/
const getGameFromDB = async () => {
    const game = await Game.find();
    if (game) {
        console.log("game: ", game);
        return game;
    } else {
        console.log("no game found");
        return null;
    }
};

/* getGame():
// - Retrieve the game data from the DB
// - Return the game
*/
const getGame = async (req, res) => {
    console.log("getGame() called");

    const gameId = req.params.id;
    
    try {
        const game = await Game.find();
        if (game) {
            console.log("game: ", game);
            res.status(200).json({
                status: 'success',
                data: {
                    game
                }
            });
        } else {
            console.log("no game found");
            res.status(500).json({
                status: 'fail',
                message: 'Unable to retrieve game data'
            });
        }
    } catch (err) {
        console.log("getGame failed \nerror: ", err);
        res.status(500).json({
            status: 'fail',
            message: 'Unable to retrieve game data'
        });
    }
};

const createGame = async (req, res) => {
    try {
        const game = await Game.find();
        if (game) {
            console.log("game already exists");
            res.status(500).json({
                status: 'fail',
                message: 'Game already exists'
            });
        } else {
            const players = await playerController.getPlayers();
            const dice = await diceController.getDice();
            const newGame = {
                players: players,
                currentRoundNumber: 1,
                gameFinished: false,
                dice: dice,
                currentPlayer: players[0]
            }
            console.log("newGame: ", newGame);
            res.status(201).json({
                status: 'success',
                data: {
                    game: newGame
                }
            });
        }
    } catch (err) {
        console.log("createGame failed \nerror: ", err);
        res.status(500).json({
            status: 'fail',
            message: 'Unable to create game'
        });
    }
};

/* resetGameData():
// - Reset the game data in the DB
// Use Cases
// - when a game is restarted
// - when "resetGame()" is called
*/
const resetGameData = async (req, res) => {
    const players = await playerController.getPlayers();
    try {
        // find specific game
        const game = await Game.find();

        // reset game data
        if (game) {
            playerController.resetAllPlayerData();
            game[0].currentRoundNumber = 1;
            game[0].gameFinished = false;
            game[0].dice = null;
            game[0].currentPlayer = players[0];
            diceController.resetDice();
        } else {
            console.log("no game found");
            res.status(500).json({
                status: 'fail',
                message: 'Unable to reset game data'
            });
        }

        // save game
        try {
            const gameToUpdate = await game.save();

            if (gameToUpdate) {
                console.log("game updated successfully");
                res.status(200).json({
                    status: 'success',
                    data: {
                        game
                    }
                });
            } else {
                console.log("game update failed");
                res.status(500).json({
                    status: 'fail',
                    message: 'Unable to reset game data'
                });
            }
        } catch (err) {
            console.log("gameToUpdate failed \nerror: ", err);
            res.status(500).json({
                status: 'fail',
                message: 'Unable to reset game data'
            });
        }
    } catch (err) {
        console.log("Reset game failed \nerror: ", err);
        return null;
    }
};

const deleteGame = async (req, res) => {
    try {
        // find specific game
        const game = await Game.find();

        // reset game data
        if (game) {
            game[0].gameFinished = true;
            playerController.removeAllPlayers();
        } else {
            console.log("no game found");
            res.status(500).json({
                status: 'fail',
                message: 'Unable to exit game'
            });
        }

        // save game
        try {
            const gameToUpdate = await game.save();

            if (gameToUpdate) {
                console.log("game updated successfully");
                res.status(200).json({
                    status: 'success',
                    data: {
                        game
                    }
                });
            } else {
                console.log("game update failed");
                res.status(500).json({
                    status: 'fail',
                    message: 'Unable to exit game'
                });
            }
        } catch (err) {
            console.log("gameToUpdate failed \nerror: ", err);
            res.status(500).json({
                status: 'fail',
                message: 'Unable to exit game'
            });
        }
    } catch (err) {
        console.log("Exit game failed \nerror: ", err);
        return null;
    }
};

/* updatePlayer():
// - Update a player in the DB
// - Return the player updated
// Use Cases
// - When a player's turn ends
*/
const updateGame = async (req, res) => {
    if (!req.body) {
        console.log("No player provided");
        res.status(400).json({
            status: 'fail',
            message: 'No player provided'
        });
    }
    try {
        const player = req.body;
        // const playerToUpdate = await Player.findOneAndUpdate({ socketId: player.socketId }, player, { new: true });
        console.log("player.socketId: ", player.socketId);
        const playerToUpdate = await Player.findOneAndUpdate(
            { socketId: player.socketId }, player, { new: true }
        ).exec();

        try {
            if (playerToUpdate) {
                console.log("player updated successfully");
                res.status(200).json({
                    status: 'success',
                    data: {
                        player
                    }
                });
            } else {
                console.log("player update failed");
                res.status(500).json({
                    status: 'fail',
                    message: 'Unable to update player'
                });
            }
        } catch (err) {
            console.log("playerToUpdate failed \nerror: ", err);
            res.status(500).json({
                status: 'fail',
                message: 'Unable to update player'
            });
        }
    } catch (err) {
        console.log("playerToUpdate failed \nerror: ", err);
        res.status(500).json({
            status: 'fail',
            message: 'Unable to update player'
        });
        return null;
    }
};

module.exports = {
    getGameFromDB,
    getGame,
    deleteGame,
    resetGameData,
    updateGame,
    createGame
};
