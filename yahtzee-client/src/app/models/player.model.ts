import { Die } from "./die.model";

// export interface Selections {
//   isPointSectionSelected: boolean;
//   selectedPointSection: PointsSection | undefined;
// }

export interface ScoreTotals {
  upperSectionTotal: number;
  upperSectionBonus: number;
  upperSectionTotalWithBonus: number;
  lowerSectionTotal: number;
  grandTotal: number;
}

export class PointsSection {
  name: string;
  description: string;
  howToScore: string;
  used: boolean;
  points: number;
  diceUsed: Die[]; // which die went into making this happen
  bonus: number; // if total score of upper is >= 63, add 35 points
  isUpperPoints: boolean;
  acceptedDie: number; // which dice are accepted for this section -- 0 means all
  isSelected: boolean; // if it's selected -- not scored yet

  constructor(
    name: string,
    description: string,
    howToScore: string,
    used: boolean,
    points: number,
    diceUsed: Die[],
    bonus: number,
    isUpperPoints: boolean,
    acceptedDie: number,
    isSelected: boolean
  )
  {
    this.name = name;
    this.description = description;
    this.howToScore = howToScore;
    this.used = used;
    this.points = points;
    this.diceUsed = diceUsed;
    this.bonus = bonus;
    this.isUpperPoints = isUpperPoints;
    this.acceptedDie = acceptedDie;
    this.isSelected = isSelected;
  }
}

export class Player {
  public id: string;
  public name: string;
  public score: number;
  public color: string;
  public pointsSections: PointsSection[];
  public rollsLeftThisRound: number;
  public scoreTotals: ScoreTotals;
  // public selections: Selections;

  constructor(id: string, name: string, score: number, color: string, pointsSections: PointsSection[], rollsLeftThisRound: number, scoreTotals: ScoreTotals) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.color = color;
    this.pointsSections = pointsSections;
    this.rollsLeftThisRound = rollsLeftThisRound;
    this.scoreTotals = scoreTotals;
    // this.selections = selections;
  }

  static availableSections = [
    new PointsSection('Aces', 'All 1\'s', 'Count and add only Aces', false, 0, [], 0, true, 1, false),
    new PointsSection('Twos', 'All 2\'s', 'Count and add only Twos', false, 0, [], 0, true, 2, false), // 'Count and add only Twos
    new PointsSection('Threes', 'All 3\'s', 'Count and add only Threes', false, 0, [], 0, true, 3, false), // 'Count and add only Threes
    new PointsSection('Fours', 'All 4\'s', 'Count and add only Fours', false, 0, [], 0, true, 4, false), // 'Count and add only Fours
    new PointsSection('Fives', 'All 5\'s', 'Count and add only Fives', false, 0, [], 0, true, 5, false), // 'Count and add only Fives
    new PointsSection('Sixes', 'All 6\'s', 'Count and add only Sixes', false, 0, [], 0, true, 6, false), // 'Count and add only Sixes
    new PointsSection('3 of a kind', '3 of the same', 'Add total of all dice', false, 0, [], 0, false, 0, false), // 'Add total of all dice (if 3 are the same)
    new PointsSection('4 of a kind', '4 of the same', 'Add total of all dice', false, 0, [], 0, false, 0, false), // 'Add total of all dice (if 4 are the same)
    new PointsSection('Full House', '3 of one number and 2 of another', 'Score 25', false, 0, [], 0, false, 0, false),
    new PointsSection('Small Straight', '4 in a row', 'Score 30', false, 0, [], 0, false, 0, false),
    new PointsSection('Large Straight', '5 in a row', 'Score 40', false, 0, [], 0, false, 0, false),
    new PointsSection('Yahtzee (5 of a kind)', '5 of the same', 'Score 50', false, 0, [], 0, false, 0, false),
    new PointsSection('Chance', 'Any combination', 'Score total of all 5 dice', false, 0, [], 0, false, 0, false)
  ];
}
