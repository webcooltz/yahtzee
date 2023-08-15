import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Subject } from 'rxjs';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { PointsSection } from '../models/points-section.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public game!: Game;
  public players: Player[] = [];
  public dice: Die[] = [];

  public selectedPointsSection: PointsSection | undefined;

  // -----static-----

  public apiUrl: string = 'http://localhost:3000';
  public pointsSections: PointsSection[] = PointsSection.availableSections
  public numberOfRounds = this.pointsSections.length; // always 13

  constructor(private http: HttpClient) {}

  // -----Subjects-----

  gameChanged = new Subject<Game>();

  // -----New Game-----

  setPlayers(playerCount: number) {
    this.players = [];
    for (var i = 0; i < playerCount; i++) {
      this.players.push(new Player(`${i + 1}`, `Player ${i + 1}`, 0, 'white',
        JSON.parse(JSON.stringify(this.pointsSections)), 3,
        {upperSectionTotal: 0, upperSectionBonus: 0, upperSectionTotalWithBonus: 0, lowerSectionTotal: 0, grandTotal: 0}));
    }
  }
  getPlayers() {
    return this.game.players.slice();
  }

  // ---Dice---

  selectDie(die: Die) {
    if (this.game.currentPlayer.rollsLeftThisRound < 3) {
      this.game.dice[die.id - 1].isSelected = die.isSelected ? false : true;
    }
  }

  fetchDice() {
    this.http
    .get<Die[]>(
      `${this.apiUrl}/dice`
    )
    .subscribe(dice => {
      this.setDice(dice);
    }
    ,(error: any) => {
      console.log(error);
    }
    );
  }

  setDice(dice: Die[]) {
    this.game.dice = dice;
  }

  rollDice() {
    const requestBody = { dice: this.game.dice };
    if (this.game.currentPlayer.rollsLeftThisRound > 0) {
      this.http
      .put<any>(
        `${this.apiUrl}/dice/roll`,
        requestBody
      )
      .subscribe(response => {
        console.log("dice (rolled): ", response.data.dice);
        this.setDice(response.data.dice);
      }
      ,(error: any) => {
        console.log(error);
      }
      );

      this.game.currentPlayer.rollsLeftThisRound--;
    } else {
      console.log("You're out of rolls!");
    }

    this.gameChanged.next(this.game);
  }

  resetDice() {
    const requestBody = { dice: this.game.dice };
    this.http
    .post<any>(
      `${this.apiUrl}/dice/reset`,
      requestBody
    )
    .subscribe(response => {
      console.log("dice (reset): ", response.data.dice);
      this.setDice(response.data.dice);
    }
    ,(error: any) => {
      console.log(error);
    }
    );
  }

  // ---Game---

  startGame() {
    // this.resetGame();
    // this.resetDice();
    this.fetchDice();

    this.game = {
      players: this.players,
      currentRoundNumber: 1,
      gameFinished: false,
      dice: this.dice,
      currentPlayer: this.players[0]
    };

    this.gameChanged.next(this.game);
  }

  getGame() {
    return this.game;
  }

  getCurrentRoundNumber() {
    return this.game.currentRoundNumber;
  }

  // -----End Turn-----

  getSelectedPointsSection() {
    this.selectedPointsSection = this.game.currentPlayer.pointsSections.find(ps => ps.isSelected === true);
    return this.selectedPointsSection;
  }
  setSelectedPointsSection(pointsSection: PointsSection) {
    this.selectedPointsSection = pointsSection;
    this.gameChanged.next(this.game);
  }

  /* clearPointsSelection():
  // -finds selected point section
  // -clears it
  // use cases
  // -when a player selects a new point section
  // -when a player rolls the dice
  // -when a player ends their turn
  */
  clearPointsSelection() {
    this.game.currentPlayer.pointsSections.forEach((ps) => {
      ps.isSelected = false;
      if (!ps.used) {
        ps.points = 0;
      }
    });
  }

  selectPointSection(pointsSection: PointsSection) {
    if (pointsSection && !pointsSection.used && this.game.currentPlayer.rollsLeftThisRound < 3) {
      this.clearPointsSelection();

      // ---set details for selected section---
      const setPointSectionDetails = (pointsSection: PointsSection) => {
        pointsSection.isSelected = true;
        this.setSelectedPointsSection(pointsSection);
        pointsSection.diceUsed = this.game.dice;
      };

      // ---UPPER SECTION--- (1-6)
      if (pointsSection.isUpperPoints === true) {
        if (this.game.dice.filter(die => die.currentNumber === pointsSection.acceptedDie).length > 0) {
          // add up all dice that match the acceptedDie
          pointsSection.points += this.game.dice.filter(die => die.currentNumber === pointsSection.acceptedDie).length * pointsSection.acceptedDie;
        } else {
          pointsSection.points = 0;
        }

        setPointSectionDetails(pointsSection);
      // ---More complicated sections---
      } else if (!pointsSection.isUpperPoints) {
        // ---3/4 OF A KIND/YAHTZEE---
        if (pointsSection.name.toLowerCase().includes("of a kind")) {
          let sharedDiceAmount = 0;

          // check if there are at least 3 of the same dice
          this.game.dice.forEach(die => {
            let similarDiceAmount = this.game.dice.filter(d => d.currentNumber === die.currentNumber).length;
            if (similarDiceAmount > 2) {
              sharedDiceAmount = similarDiceAmount;
            }
          });

          // -3 of a kind- (add up all dice)
          if (pointsSection.name.toLowerCase().includes("3") && sharedDiceAmount > 2) {
            pointsSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          // -4 of a kind- (add up all dice)
          } else if (pointsSection.name.toLowerCase().includes("4") && sharedDiceAmount > 3) {
            pointsSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          // -yahtzee (5 of a kind)- (50 points)
          } else if (pointsSection.name.toLowerCase().includes("5") && sharedDiceAmount > 4) {
            pointsSection.points = 50;
          } else {
            pointsSection.points = 0;
          }

          setPointSectionDetails(pointsSection);
        // ---FULL HOUSE---
        } else if (pointsSection.name.toLowerCase().includes("house")) {
          let threeOfAKind = false;
          let twoOfAKind = false;

          // if it contains 3 of one type and 2 of another:
          this.game.dice.forEach(die => {
            let similarDiceAmount = this.game.dice.filter(d => d.currentNumber === die.currentNumber).length;
            if (similarDiceAmount === 3) {
              threeOfAKind = true;
            } else if (similarDiceAmount === 2) {
              twoOfAKind = true;
            }
          });

          if (threeOfAKind && twoOfAKind) {
            pointsSection.points = 25;
          } else {
            pointsSection.points = 0;
          }

          setPointSectionDetails(pointsSection);
        // ---STRAIGHTS---
        } else if (pointsSection.name.toLowerCase().includes("straight")) {
          let smallStraight = false;
          let largeStraight = false;

          // ---SMALL STRAIGHT---
          if (pointsSection.name.toLowerCase().includes("small")) {
            // if it contains 4 consecutive numbers
            this.game.dice.map(die => die.currentNumber).sort().forEach((die, index, array) => {
              // Check for small straight
              if (index <= array.length - 4 && array[index + 3] === die + 3) {
                smallStraight = true;
              }
            });
          } else if (pointsSection.name.toLowerCase().includes("large")) {
            this.game.dice.map(die => die.currentNumber).sort().forEach((die, index, array) => {
              // Check for large straight
              if (index <= array.length - 5) {
                let isLargeStraight = true;
                for (let i = index; i < index + 4; i++) {
                  if (array[i + 1] !== array[i] + 1) {
                    isLargeStraight = false;
                    break;
                  }
                }
                if (isLargeStraight) {
                  largeStraight = true;
                }
              }
            });
          }

          if (smallStraight) {
            pointsSection.points = 30;
          } else if (largeStraight) {
            pointsSection.points = 40;
          } else {
            pointsSection.points = 0;
          }

          setPointSectionDetails(pointsSection);
        } else if (pointsSection.name.toLowerCase().includes("chance")) {
          // ---CHANCE--- add up all dice
          pointsSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          setPointSectionDetails(pointsSection);
        }
      }
    }
  }

  // to calculate score at the end of each turn
  // gets the selected point section and sets it to used
  calculateRoundScore() {
    const selectedPointSection = this.game.currentPlayer.pointsSections.find(ps => ps.isSelected === true);
    if (selectedPointSection) {
      selectedPointSection.used = true;
    }
  }

  // total up the user's score
  calculateScoreTotals() {
    const upperSectionTotal = this.game.currentPlayer.pointsSections.filter(ps => ps.isUpperPoints === true).reduce((acc, ps) => acc + ps.points, 0);
    const upperSectionBonus = upperSectionTotal >= 63 ? 35 : 0;
    const upperSectionTotalWithBonus = upperSectionTotal + upperSectionBonus;
    const lowerSectionTotal = this.game.currentPlayer.pointsSections.filter(ps => ps.isUpperPoints === false).reduce((acc, ps) => acc + ps.points, 0);
    const grandTotal = upperSectionTotalWithBonus + lowerSectionTotal;

    this.game.currentPlayer.scoreTotals = {
      upperSectionTotal,
      upperSectionBonus,
      upperSectionTotalWithBonus,
      lowerSectionTotal,
      grandTotal
    };

    this.game.currentPlayer.score = grandTotal;
  }

  // to change the active player at the end of each turn
  nextPlayer() {
    const currentPlayerIndex = this.game.players.findIndex(player => player.id === this.game.currentPlayer.id);
    const nextPlayerIndex = currentPlayerIndex + 1;

    if (nextPlayerIndex === this.game.players.length) {
      this.game.currentPlayer = this.game.players[0];
    } else {
      this.game.currentPlayer = this.game.players[nextPlayerIndex];
    }
  }

  // to change the round at the end of each turn
  nextRound() {
    if (this.game.currentRoundNumber === this.numberOfRounds && this.game.currentPlayer.id === this.game.players[0].id) {
      this.endGame();
      return;
    }
    // since this is called after (nextPlayer()), use [0]
    if (this.game.currentPlayer.id === this.game.players[0].id) {
      this.game.currentRoundNumber++;
    }
  }

  resetTurnVariables() {
    this.resetDice();
    // replace with reset func -- will reset via API and that will call the controllers separately
    this.game.dice = this.dice.slice();

    this.players.forEach(player => player.rollsLeftThisRound = 3);
  }

  /* endTurn():
  1. calculate score
  2. change active player
  3. change round
  */
  endTurn() {
    this.calculateRoundScore();
    this.calculateScoreTotals();
    this.nextPlayer();
    this.nextRound();
    this.resetTurnVariables();

    this.gameChanged.next(this.game);
  }

  // -----End of game-----

  resetGameVariables() {

  }

  // to start the game over with the same options enabled
  resetGame() {
    // this.resetTurnVariables();
    this.players.forEach(player => {
      player.score = 0;
      player.pointsSections = JSON.parse(JSON.stringify(this.pointsSections));
      player.scoreTotals = {upperSectionTotal: 0, upperSectionBonus: 0, upperSectionTotalWithBonus: 0, lowerSectionTotal: 0, grandTotal: 0};
    });

    this.startGame();
  }

  // to exit the game and go back to the home page
  exitGame() {
    this.resetGame();
    this.players = [];
    // this.setDice();
    this.game.gameFinished  = true;
  }

  endGame() {
    this.game.gameFinished = true;
  }
}
