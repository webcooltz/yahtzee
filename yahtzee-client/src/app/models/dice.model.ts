import { Die } from "./die.model";

export class Dice {
  public gameId: number;
  public currentDice: Die[];

  constructor(gameId: number, currentDice: Die[]) {
    this.gameId = gameId;
    this.currentDice = currentDice;
  }
}
