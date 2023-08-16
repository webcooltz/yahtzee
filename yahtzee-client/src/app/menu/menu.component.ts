import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { SocketService } from '../services/socket.service'; // Create a SocketService to manage socket connections

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  playerCounts: number[] = [1, 2, 3, 4, 5, 6];
  playerSelection: number = 1;

  constructor(
    private router: Router,
    private gameService: GameService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.socketService.connect(); // Establish socket connection
    this.socketService.on('playerCountChanged', (playerCount: number) => {
      // Update playerCounts array based on player count
      this.playerCounts = Array.from({ length: playerCount }, (_, i) => i + 1);
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect(); // Disconnect socket when component is destroyed
  }

  onStartGame() {
    this.gameService.setPlayers(this.playerSelection);
    this.router.navigate(['/game']);
  }
}
