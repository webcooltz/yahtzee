import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Subject } from 'rxjs';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { PointsSection } from '../models/points-section.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public game!: Game;
  public players: Player[] = [];
  public dice: Die[] = [];

  // -----static-----

  public pointsSections: PointsSection[] = PointsSection.availableSections
  public numberOfRounds = this.pointsSections.length; // always 13

  constructor() {
  }

  // -----Subjects-----

  gameChanged = new Subject<Game>();

  // -----New Game-----

  setPlayers(playerCount: number) {
    this.players = [];
    for (var i = 0; i < playerCount; i++) {
      this.players.push(new Player(`Player ${i + 1}`, 0, 'white', `${i + 1}`, JSON.parse(JSON.stringify(this.pointsSections)), 3, {upperSectionTotal: 0, upperSectionBonus: 0, upperSectionTotalWithBonus: 0, lowerSectionTotal: 0, grandTotal: 0}));
    }
  }
  getPlayers() {
    return this.game.players.slice();
  }

  setDice() {
    this.dice = JSON.parse(JSON.stringify(Die.cleanDice));
  }
  getDice() {
    return this.game.dice.slice();
  }

  startGame() {
    this.setDice();

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

  // to calculate score at the end of each turn
  calculateRoundScore() {
    const selectedPointSection = this.game.currentPlayer.pointsSections.find(ps => ps.isSelected === true);
    if (selectedPointSection) {
      // this.game.currentPlayer.score += selectedPointSection.points;
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
    this.setDice();
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

  endGame() {
    this.game.gameFinished = true;
  }
}
