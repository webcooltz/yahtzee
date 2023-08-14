import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  playerCounts: number[] = [1, 2, 3, 4, 5, 6];
  playerSelection: number = 1;

  constructor(private router: Router, private gameService: GameService) {}

  onStartGame() {
    this.gameService.setPlayers(this.playerSelection);
    this.router.navigate(['/game']);
  }
}
