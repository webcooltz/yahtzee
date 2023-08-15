import { Component, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { PointsSection } from '../models/points-section.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy {
  gameChangeSub: Subscription;
  game: Game;

  selectedPointsSection!: PointsSection | undefined;
  isPointsSectionSelected = false;

  constructor(private gameService: GameService) {
    this.gameService.startGame();
    this.game = this.gameService.getGame();

    this.gameChangeSub = this.gameService.gameChanged
    .subscribe(
      (game: Game) => {
        this.game = game;
        this.selectedPointsSection = this.gameService.getSelectedPointsSection();
        this.isPointsSectionSelected = this.selectedPointsSection ? true : false;
      });
  }

  ngOnDestroy() {
    this.gameChangeSub.unsubscribe();
  }

  // ----------GAME LOGIC----------

  /* selectDie():
  // -select a die (to toggle re-roll ability)
  */
  selectDie(die: Die) {
    this.gameService.selectDie(die);
  }

  /* rollDice():
  // -roll all dice that are not selected
  // -random number between 1-6 to roll
  */
  rollDice() {
    this.clearPointsSelection();
    this.gameService.rollDice();
  }

  /* selectPointsSection():
  // -select a points section
  // -mark it as selected if it meets conditions
  */
  selectPointSection(pointSection: PointsSection) {
    if (pointSection) {
      this.gameService.selectPointSection(pointSection);
    }
  }

  /* clearPointsSelection():
  // -clear isSelected
  // -clear points
  */
  clearPointsSelection() {
    this.gameService.clearPointsSelection();
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
// -move component logic to service and API
// -if yahtzee, show alert, auto-count it
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
