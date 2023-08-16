import { Dice } from "./dice.model";
import { Player } from "./player.model";

export class Game {
  public id: string;
  public players: Player[];
  public currentRoundNumber: number;
  public gameFinished: boolean = false;
  public dice: Dice;
  public currentPlayer: Player;

  constructor(id: string, players: Player[], currentRoundNumber: number, gameFinished: boolean, dice: Dice, currentPlayer: Player) {
    this.id = id;
    this.players = players;
    this.currentRoundNumber = currentRoundNumber;
    this.gameFinished = gameFinished;
    this.dice = dice;
    this.currentPlayer = currentPlayer;
  }
}
