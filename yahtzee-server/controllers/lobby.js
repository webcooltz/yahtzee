/* lobby.js:
// - Before game starts, users are in the lobby
// - When users connect, add them to the database/lobby
// - If user disconnects, remove them from the lobby
// - When game starts, remove all users from the lobby --> to the game
*/
const Lobby = require('../models/lobby');

/* generateLobbyCode():
// - Generate a random 4-digit code
// - Return the code
*/
const generateLobbyCode = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const codeNumber = Math.floor(Math.random() * 10000);
    const codeLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const code = codeNumber.toString() + codeLetter;
    return code;
};

/* newLobby(): POST /lobby
// - Create a new lobby
// - Return the lobby
// Use Cases:
// - When user creates a new lobby
// - When exitGame() is called
*/
const newLobby = async (req, res) => {
    console.log("req.params: ", req.params);
    console.log("req.body: ", req.body);
    const playerId = req.body.playerId;
    console.log("playerId: ", playerId);
    const lobby = new Lobby({
        code: generateLobbyCode(),
        players: [playerId],
        host: playerId
    }); 

    try {
        const savedLobby = await lobby.save();
        if (savedLobby) {
            console.log("savedLobby: ", savedLobby);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lobby);
            return savedLobby;
        } else {
            console.log("no lobby saved");
            res.status(500).json({ error: 'Unable to create lobby' });
            return null;
        }
    } catch (err) {
        console.log("newLobby failed \nerror: ", err);
        res.status(500).json({ error: err });
        return null;
    }
};

/* getLobbyByCode(): GET /lobby/:code
// - Retrieve lobby by code
// - Return the lobby
// Use Cases:
// - When user joins a lobby (types code or URL)
*/
const getLobbyByCode = async (lobbyCode) => {
    console.log("lobbyCode: ", lobbyCode);
    try {
        const lobbies = await Lobby.find({ code: lobbyCode });
        if (lobbies) {
            console.log("lobby (getLobbyByCode): ", lobbies);
            return lobbies[0];
        } else {
            console.log("no lobby found");
            return null;
        }
    } catch (error) {
        console.log("catch -- getLobbyByCode failed \nerror: ", error);
        return null;
    }
};

/* joinLobby(): PUT /lobby/:code/join
// - Add user to lobby
// - Return the lobby
// Use Cases:
// - When user joins a lobby (types code or URL)
*/
const joinLobby = async (req, res) => {
    const playerId = req.body.playerId;
    const lobbyCode = req.params.code;

    try {
        getLobbyByCode(lobbyCode).then(async lobby => {
            if (lobby) {
                // insert player into lobby:
                console.log("lobby (joinLobby): ", lobby);
                lobby.players.push(playerId);

                // save lobby:
                const lobbyToSave = await lobby.save();

                if (lobbyToSave) {
                    console.log("lobby joined successfully: ", lobbyToSave.code);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(lobbyToSave);
                } else {
                    console.log("Unable to join lobby (not saved)");
                    res.status(500).json({ error: 'Unable to join lobby (not saved)' });
                }
            } else {
                console.log("no lobby found");
                res.status(500).json({ error: 'Unable to join lobby (no lobby found)' });
            }
        });
    } catch (err) {
        console.log("joinLobby failed \nerror: ", err);
        res.status(500).json({ error: err });
    }
};

/* leaveLobby(): PUT /lobby/:code/leave
// - Remove user from lobby
// - Return the lobby
// Use Cases:
// - When user leaves a lobby
*/
const leaveLobby = async (req, res) => {
    const playerId = req.body.playerId;
    const lobbyCode = req.params.code;

    try {
        getLobbyByCode(lobbyCode).then(async lobby => {
            if (lobby) {
                // remove player from lobby:
                lobby.players = lobby.players.filter(player => player === playerId);

                // save lobby:
                const lobbyToSave = await lobby.save();

                if (lobbyToSave) {
                    console.log("lobby left: ", lobbyToSave);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(lobbyToSave);
                } else {
                    console.log("Unable to leave lobby (not saved)");
                    res.status(500).json({ error: 'Unable to leave lobby (not saved)' });
                }
            } else {
                console.log("Unable to leave lobby (not found)");
                res.status(500).json({ error: 'Unable to leave lobby (not found)' });
            }
        });
    } catch (err) {
        console.log("joinLobby failed \nerror: ", err);
        res.status(500).json({ error: err });
    }
};

/* deleteLobby(): DELETE /lobby/:code
// - Delete lobby
// - Return the lobby
// Use Cases:
// - When a game starts
// - When all users leave a lobby
*/
const deleteLobby = async (req, res) => {
    const lobbyCode = req.params.code;
    console.log("lobbyCode: ", lobbyCode);

    try {
        getLobbyByCode(lobbyCode).then(async lobby => {
            if (lobby) {
                console.log("lobby (deleteLobby): ", lobby);
                const lobbyToDelete = await lobby.deleteOne();

                if (lobbyToDelete) {
                    console.log("lobbyToDelete: ", lobbyToDelete);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json(lobbyToDelete);
                } else {
                    console.log("no lobby deleted");
                    res.status(500).json({ error: 'Unable to delete lobby' });
                }
            } else {
                console.log("no lobby found");
                res.status(500).json({ error: 'Unable to delete lobby' });
            }
        });
    } catch (err) {
        console.log("deleteLobby failed \nerror: ", err);
        res.status(500).json({ error: err });
    }
};

module.exports = {
    newLobby,
    joinLobby,
    leaveLobby,
    deleteLobby
};