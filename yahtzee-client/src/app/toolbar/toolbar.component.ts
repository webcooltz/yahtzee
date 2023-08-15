import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import { Game } from '../models/game.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  gameChangeSub: Subscription;
  game: Game;
  isGameInProgress!: boolean;

  constructor(private gameService: GameService, private router: Router) {
    this.game = this.gameService.getGame();

    this.gameChangeSub = this.gameService.gameChanged
    .subscribe(
      (game: Game) => {
        this.game = game;
        this.isGameInProgress = this.gameService.game.gameFinished ? false : true;
      });

    // this.isGameInProgress = this.gameService.game.gameFinished ? false : true;
  }

  onMenuItemClick(option: string) {
    switch(option) {
      case 'resetGame':
        this.gameService.resetGame();
        break;
      case 'exitGame':
        this.gameService.exitGame();
        this.router.navigate(['/']);
        break;
      default:
        break;
    }
  }
}
