import { Die } from "./die.model";
import { Player } from "./player.model";
import { Selections } from "./selections.model";

export class Game {
  public players: Player[];
  public currentRoundNumber: number;
  public gameFinished: boolean = false;
  public dice: Die[];
  public currentPlayer: Player;
  public selections: Selections

  constructor(players: Player[], currentRoundNumber: number, gameFinished: boolean, dice: Die[], currentPlayer: Player, selections: Selections) {
    this.players = players;
    this.currentRoundNumber = currentRoundNumber;
    this.gameFinished = gameFinished;
    this.dice = dice;
    this.currentPlayer = currentPlayer;
    this.selections = selections;
  }
}
