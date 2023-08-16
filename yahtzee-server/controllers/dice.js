const Die = require('../models/dice');

/* getDiceByGameId():
// - Retrieve dice for game session
// - Return the dice
*/
const getDiceByGameId = async (gameId) => {
    console.log("gameId: ", gameId);
    try {
        const dice = await Die.find({ gameId: gameId });
        if (dice) {
            console.log("dice: ", dice);
            return dice;
        } else {
            console.log("no dice found");
            return null;
        }
    } catch (err) {
        console.log("getDiceByGameId failed \nerror: ", err);
        return null;
    }
};

/* getDice():
// - Retrieve dice for game session
// - Return the dice
*/
const getDice = async (req, res) => {
    const gameId = req.params.id;

    try {
        getDiceByGameId(gameId).then(dice => {
            if (dice) {
                console.log("dice: ", dice);
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(dice);
            } else {
                res.status(500).json({ error: 'Unable to retrieve dice' });
            }
        });
    } catch (err) {
        console.log("getDice failed \nerror: ", err);
        res.status(500).json({ error: err });
    }
};

/* rollDice():
// - Receive all dice state from user
// - Simulate rolling dice by generating a random number between 1 and 6
// - Create new Die instance with the rolled value
// - Update the DB with the new Die instance
// - Return the rolled dice value in the response
*/
const rollDice = async (req, res) => {
    // console.log("rollDice() called");
    if (!req.body) {
        res.status(400).json({
            status: 'fail',
            message: 'No dice provided'
        });
    }

    try {
        let didDiceSucceed = true;
        let dice = req.body.dice;

        // console.log("dice: ", dice);

        dice.filter(die => die.isSelected).forEach(async die => {
            const newDieValue = Math.floor(Math.random() * 6) + 1;

            if (die.currentNumber !== newDieValue) {
                die.currentNumber = newDieValue;
                const response = await Die.findOneAndUpdate(
                    { id: die.id},
                    { $set: die },
                    { new: false }
                ).exec();

                if (response) {
                    console.log("die value updated");
                } else {
                    didDiceSucceed = false;
                    console.log("die value not updated");
                }
            } else {
                console.log("no change in die value");
            }
        });

        if (didDiceSucceed) {
            res.status(200).json({
                status: 'success',
                data: {
                    dice
                }
            });
        } else {
            res.status(500).json({
                status: 'fail',
                message: 'Unable to update dice'
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }
};

/* POST resetDice():
// - Reset all dice to 0
// - Update the DB with the new die instances
// - Return the dice
*/
const resetDice = async (req, res) => {
    getDiceFromDB().then(dice => {
        let didDiceSucceed = true;

        if (dice) {
            dice.forEach(async (die) => {
                die.currentNumber = 0;
                die.isSelected = true;
                const response = await Die.findOneAndUpdate(
                    { id: die.id},
                    { $set: die },
                    { new: false }
                ).exec();

                if (response) {
                    console.log("die value updated");
                } else {
                    console.log("die value not updated");
                    didDiceSucceed = false;
                }
            });

            if (didDiceSucceed) {
                res.status(200).json({
                    status: 'success',
                    data: {
                        dice
                    }
                });
            } else {
            res.status(500).json({
                status: 'fail',
                message: 'Unable to update dice'
            });
            }
        } else {
            res.status(500).json({
                status: 'fail',
                message: 'Unable to retrieve dice'
            });
        }
    });
};

module.exports = {
    rollDice,
    getDice,
    resetDice
};
