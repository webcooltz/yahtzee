import { Component, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { PointsSection } from '../models/points-section.model';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy {
  gameChangeSub: Subscription;
  game: Game;
  players: Player[] = [];

  pointSectionSelected: boolean;
  selectedPointSection!: PointsSection;

  constructor(private gameService: GameService) {
    this.gameService.startGame();
    this.game = this.gameService.getGame();
    this.players = this.gameService.getPlayers();

    this.gameChangeSub = this.gameService.gameChanged
    .subscribe(
      (game: Game) => {
        this.game = game;
        this.players = this.gameService.getPlayers();
      });

    this.pointSectionSelected = false;
  }

  ngOnDestroy() {
    this.gameChangeSub.unsubscribe();
  }

  // ----------GAME LOGIC----------

  /* selectDie():
  // -select a die (to toggle re-roll ability)
  */
  selectDie(die: Die) {
    if (this.game.currentPlayer.rollsLeftThisRound < 3) {
      this.game.dice[die.id - 1].isSelected = die.isSelected ? false : true;
    }
  }

  /* rollDice():
  // -roll all dice that are not selected
  // -random number between 1-6 to roll
  */
  rollDice() {
    this.clearPointsSelection();

    if (this.game.currentPlayer.rollsLeftThisRound > 0) {
      this.game.dice.filter(die => die.isSelected).forEach(die => {
        die.currentNumber = Math.floor(Math.random() * 6) + 1;
        console.log("this.dice: ", this.game.dice);
      });
      this.game.currentPlayer.rollsLeftThisRound--;
    }
  }

  /* selectPointsSection():
  // -select a points section
  // -mark it as selected if it meets conditions
  */
  selectPointSection(pointSection: PointsSection) {
    if (pointSection && !pointSection.used && this.game.currentPlayer.rollsLeftThisRound < 3) {
      console.log("selected: ", pointSection);
      this.clearPointsSelection();

      // ---set details for selected section---
      const setPointSectionDetails = (pointSection: PointsSection) => {
        pointSection.isSelected = true;
        pointSection.diceUsed = this.game.dice;
        this.pointSectionSelected = true;
        this.selectedPointSection = pointSection;
      };

      // ---UPPER SECTION--- (1-6)
      if (pointSection.isUpperPoints === true) {
        if (this.game.dice.filter(die => die.currentNumber === pointSection.acceptedDie).length > 0) {
          // add up all dice that match the acceptedDie
          pointSection.points += this.game.dice.filter(die => die.currentNumber === pointSection.acceptedDie).length * pointSection.acceptedDie;
        } else {
          pointSection.points = 0;
        }

        setPointSectionDetails(pointSection);
      // ---More complicated sections---
      } else if (!pointSection.isUpperPoints) {
        // ---3/4 OF A KIND/YAHTZEE---
        if (pointSection.name.toLowerCase().includes("of a kind")) {
          let sharedDiceAmount = 0;

          // check if there are at least 3 of the same dice
          this.game.dice.forEach(die => {
            let similarDiceAmount = this.game.dice.filter(d => d.currentNumber === die.currentNumber).length;
            if (similarDiceAmount > 2) {
              sharedDiceAmount = similarDiceAmount;
            }
          });

          // -3 of a kind- (add up all dice)
          if (pointSection.name.toLowerCase().includes("3") && sharedDiceAmount > 2) {
            pointSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          // -4 of a kind- (add up all dice)
          } else if (pointSection.name.toLowerCase().includes("4") && sharedDiceAmount > 3) {
            pointSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          // -yahtzee (5 of a kind)- (50 points)
          } else if (pointSection.name.toLowerCase().includes("5") && sharedDiceAmount > 4) {
            pointSection.points = 50;
          } else {
            pointSection.points = 0;
          }

          setPointSectionDetails(pointSection);
        // ---FULL HOUSE---
        } else if (pointSection.name.toLowerCase().includes("house")) {
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
            pointSection.points = 25;
          } else {
            pointSection.points = 0;
          }

          setPointSectionDetails(pointSection);
        // ---STRAIGHTS---
        } else if (pointSection.name.toLowerCase().includes("straight")) {
          let smallStraight = false;
          let largeStraight = false;

          // ---SMALL STRAIGHT---
          if (pointSection.name.toLowerCase().includes("small")) {
            // if it contains 4 consecutive numbers
            this.game.dice.map(die => die.currentNumber).sort().forEach((die, index, array) => {
              // Check for small straight
              if (index <= array.length - 4 && array[index + 3] === die + 3) {
                smallStraight = true;
              }
            });
          } else if (pointSection.name.toLowerCase().includes("large")) {
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
            pointSection.points = 30;
          } else if (largeStraight) {
            pointSection.points = 40;
          } else {
            pointSection.points = 0;
          }

          setPointSectionDetails(pointSection);
        } else if (pointSection.name.toLowerCase().includes("chance")) {
          // ---CHANCE--- add up all dice
          pointSection.points = this.game.dice.reduce((total, die) => total + die.currentNumber, 0);
          setPointSectionDetails(pointSection);
        }
      }
    }
  }

  /* clearPointsSelection():
  // -clear isSelected
  // -clear points
  */
  clearPointsSelection() {
    this.game.currentPlayer.pointsSections.forEach((ps, i) => {
      ps.isSelected = false;
      if (!ps.used) {
        ps.points = 0;
      }
    });
    this.pointSectionSelected = false;
  }

  /* skipTurn():
  // -if user is unable to select a point section, this selects one and sets it to 0
  */
  skipTurn() {
    this.gameService.endTurn();
    this.clearPointsSelection();
  }

  /* endTurn():
  // -if user can select a section, scores it and ends turn
  */
  endTurn() {
    this.gameService.endTurn();
    this.clearPointsSelection();
  }

  endGame() {
    this.gameService.endGame();
  }

}

/* todo
// -player wins
// -player highlighting (current player)
// -menu -- select players works with > 2
// -fix roll 3 times if changing roll ?
// -do all the rolls before selecting points ???
// -game finished early -- test
// -3-4-5-6 small straight issue?
// -add debug button which saves the game state to .txt file
// -add log file?
// -add game history
// -add debug button to fix errors if needed manually
// -add test files to test all functions -- multiple scenarios
// -view different score cards at the end of the game
// -add which dice were used for each point section
*/
