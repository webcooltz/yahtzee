import { Die } from "./die.model";
import { Player } from "./player.model";

export class Game {
  public players: Player[];
  public currentRoundNumber: number;
  public gameFinished: boolean = false;
  public dice: Die[];
  public currentPlayer: Player;

  constructor(players: Player[], currentRoundNumber: number, gameFinished: boolean, dice: Die[], currentPlayer: Player) {
    this.players = players;
    this.currentRoundNumber = currentRoundNumber;
    this.gameFinished = gameFinished;
    this.dice = dice;
    this.currentPlayer = currentPlayer;
  }
}
