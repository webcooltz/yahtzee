export class Die {
  public id: number;
  public currentNumber: number;
  public isSelected: boolean = false;

  constructor(id: number, currentNumber: number, isSelected: boolean) {
    this.id = id;
    this.currentNumber = currentNumber;
    this.isSelected = isSelected;
  }

  static cleanDice: Die[] = [
    new Die(1, 0, true),
    new Die(2, 0, true),
    new Die(3, 0, true),
    new Die(4, 0, true),
    new Die(5, 0, true)
  ];
}
