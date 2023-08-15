import { Die } from "./die.model";

export class PointsSection {
  public name: string;
  public description: string;
  public howToScore: string;
  public used: boolean = false;
  public points: number = 0;
  public diceUsed: Die[] = []; // which die went into making this happen
  public bonus: number; // if total score of upper is >= 63, add 35 points
  public isUpperPoints: boolean;
  public acceptedDie: number; // which dice are accepted for this section -- 0 means all
  public isSelected: boolean = false; // if it's selected -- not scored yet

  constructor(name: string, description: string, howToScore: string, used: boolean, points: number, diceUsed: Die[], bonus: number, isUpperPoints: boolean, acceptedDie: number, isSelected: boolean) {
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
