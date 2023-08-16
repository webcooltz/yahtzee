export class Die {
  public id: number;
  public currentNumber: number;
  public isSelected: boolean = false;

  constructor(id: number, currentNumber: number, isSelected: boolean) {
    this.id = id;
    this.currentNumber = currentNumber;
    this.isSelected = isSelected;
  }
}
