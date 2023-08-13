import { PointsSection } from "./points-section.model";
import { ScoreTotals } from "./score-totals.model";

export class Player {
  public name: string;
  public score: number;
  public color: string;
  public id: string;
  public pointsSections: PointsSection[];
  public rollsLeftThisRound: number;
  public scoreTotals: ScoreTotals;

  constructor(name: string, score: number, color: string, id: string, pointsSections: PointsSection[], rollsLeftThisRound: number, scoreTotals: ScoreTotals) {
    this.name = name;
    this.score = score;
    this.color = color;
    this.id = id;
    this.pointsSections = pointsSections;
    this.rollsLeftThisRound = rollsLeftThisRound;
    this.scoreTotals = scoreTotals;
  }
}
