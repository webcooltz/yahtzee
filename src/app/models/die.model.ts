export class Die {
  public id: number;
  public currentNumber: number;
  public isSelected: boolean = false;
  public rollable: boolean;

  constructor(id: number, rollable: boolean, currentNumber: number, isSelected: boolean) {
    this.id = id;
    this.rollable = rollable;
    this.currentNumber = currentNumber;
    this.isSelected = isSelected;
  }

  static cleanDice: Die[] = [
    new Die(1, true, 1, true),
    new Die(2, true, 2, true),
    new Die(3, true, 3, true),
    new Die(4, true, 4, true),
    new Die(5, true, 5, true)
  ];
}
