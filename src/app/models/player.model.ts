import { PointsSection } from "./points-section.model";

export class Player {
  public name: string;
  public score: number;
  public color: string;
  public id: string;
  public pointsSections: PointsSection[];
  public rollsLeftThisRound: number;

  constructor(name: string, score: number, color: string, id: string, pointsSections: PointsSection[], rollsLeftThisRound: number) {
    this.name = name;
    this.score = score;
    this.color = color;
    this.id = id;
    this.pointsSections = pointsSections;
    this.rollsLeftThisRound = rollsLeftThisRound;
  }
}
