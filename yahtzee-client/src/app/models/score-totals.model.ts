export class ScoreTotals {
  public upperSectionTotal: number;
  public upperSectionBonus: number;
  public upperSectionTotalWithBonus: number;
  public lowerSectionTotal: number;
  public grandTotal: number;

  constructor(upperSectionTotal: number, upperSectionBonus: number, upperSectionTotalWithBonus: number, lowerSectionTotal: number, grandTotal: number) {
    this.upperSectionTotal = upperSectionTotal;
    this.upperSectionBonus = upperSectionBonus;
    this.upperSectionTotalWithBonus = upperSectionTotalWithBonus;
    this.lowerSectionTotal = lowerSectionTotal;
    this.grandTotal = grandTotal;
  }
}
