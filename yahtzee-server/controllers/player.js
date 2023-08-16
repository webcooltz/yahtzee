const Player = require('../models/player');

/* getPlayersFromDB():
// - Retrieve all players from the DB
// - Return the players
*/
const getPlayersFromDB = async () => {
    const players = await Player.find();
    if (players) {
        // console.log("players: ", players);
        return players;
    } else {
        console.log("no players found");
        return null;
    }
};

/* getPlayers():
// - Retrieve all players from the DB
// - Return the players
*/
const getPlayers = async (req, res) => {
    // console.log("getPlayers() called");
    getPlayersFromDB().then(players => {
        if (players) {
            // console.log("players: ", players);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(players);
        } else {
            res.status(500).json({ error: 'Unable to retrieve players' });
        }
    });
};

/* addPlayer():
// - Add a player to the DB
// - Return the player added
// Use Cases
// - when a player joins a game
*/
const addPlayer = async (user) => {
    // get players where gameId = lobby?.code
    const players = await getPlayersFromDB();
    const lastId = players.length > 0 ? players[players.length - 1].id : 0;

    if (!user) {
        console.log("user is null");
        return;
    } else {
        const player = new Player({
            id: parseInt(lastId) + 1,
            name: user.ip,
            score: 0,
            color: "white",
            pointsSections: [
                {name: 'Aces', description: 'All 1\'s', howToScore: 'Count and add only Aces', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 1, isSelected: false},
                {name: 'Twos', description: 'All 2\'s', howToScore: 'Count and add only Twos', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 2, isSelected: false},
                {name: 'Threes', description: 'All 3\'s', howToScore: 'Count and add only Threes', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 3, isSelected: false},
                {name: 'Fours', description: 'All 4\'s', howToScore: 'Count and add only Fours', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 4, isSelected: false},
                {name: 'Fives', description: 'All 5\'s', howToScore: 'Count and add only Fives', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 5, isSelected: false},
                {name: 'Sixes', description: 'All 6\'s', howToScore: 'Count and add only Sixes', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: true, acceptedDie: 6, isSelected: false},
                {name: '3 of a kind', description: '3 of the same', howToScore: 'Add total of all dice', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: '4 of a kind', description: '4 of the same', howToScore: 'Add total of all dice', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: 'Full House', description: '3 of one number and 2 of another', howToScore: 'Score 25', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: 'Small Straight', description: '4 in a row', howToScore: 'Score 30', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: 'Large Straight', description: '5 in a row', howToScore: 'Score 40', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: 'Yahtzee', description: '5 of the same', howToScore: 'Score 50', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false},
                {name: 'Chance', description: 'Any combination', howToScore: 'Score total of all dice', used: false, points: 0, diceUsed: [], bonus: 0, isUpperPoints: false, acceptedDie: 0, isSelected: false}
              ],
            rollsLeftThisRound: 3,
            scoreTotals: {
                upperSectionTotal: 0,
                upperSectionBonus: 0,
                upperSectionTotalWithBonus: 0,
                lowerSectionTotal: 0,
                grandTotal: 0
            },
            socketId: user.id,
            // gameId: "",
            // lobbyId: "",
        });

        const playerToUpdate = await player.save();

        if (playerToUpdate) {
            console.log("player updated successfully");
            return playerToUpdate;
        } else {
            console.log("playerToUpdate failed");
            return null;
        }
    }
};

/* removePlayer():
// - Remove a player from the DB
// - Return the player removed
// Use Cases
// - when a player leaves a game
*/
const removePlayer = async (user) => {
    console.log("user: ", user.id);

    try {
        const player = await Player.findOneAndDelete({ socketId: user.id });

        if (player) {
            console.log("deleted player: ", player.id);
            return player;
        } else {
            console.log("delete player failed");
            // return null;
        }
    } catch (err) {
        console.log("delete player failed \nerror: ", err);
        return null;
    }
};

/* removeAllPlayers():
// - Remove all players from the DB
// - Return the players removed
// Use Cases
// - when a game is over, exited, etc.
// - when "exitGame()" is called
*/
const removeAllPlayers = async () => {
    try {
        const players = await Player.deleteMany({});
        if (players) {
            console.log("deleted all players");
            return players;
        } else {
            console.log("delete players failed");
            return null;
        }
    } catch (err) {
        console.log("delete players failed \nerror: ", err);
        return null;
    }
};

/* resetAllPlayerData():
// - Reset all player data in the DB
// - Return the players updated
// Use Cases
// - when a game is restarted
// - when "resetGame()" is called
*/
const resetAllPlayerData = async () => {
    try {
        const players = await Player.find({});

         // Update each player's data
         const updatePromises = players.map(async player => {
            player.score = 0;
            player.pointsSections.forEach(section => {
                section.used = false;
                section.points = 0;
                section.diceUsed = [];
                section.bonus = 0;
                section.isSelected = false;
            });
            player.rollsLeftThisRound = 3;
            player.scoreTotals.upperSectionTotal = 0;
            player.scoreTotals.upperSectionBonus = 0;
            player.scoreTotals.upperSectionTotalWithBonus = 0;
            player.scoreTotals.lowerSectionTotal = 0;
            player.scoreTotals.grandTotal = 0;

            await player.save(); // Save each modified player
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        console.log("Reset all players");
        return players;

    } catch (err) {
        console.log("Reset players failed \nerror: ", err);
        return null;
    }
};

/* updatePlayer():
// - Update a player in the DB
// - Return the player updated
// Use Cases
// - When a player's turn ends
*/
const updatePlayer = async (req, res) => {
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
    getPlayers,
    addPlayer,
    removePlayer,
    removeAllPlayers,
    resetAllPlayerData,
    updatePlayer
};
