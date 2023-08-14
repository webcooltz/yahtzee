import { PointsSection } from "./points-section.model";

export class Selections {
  public isPointSectionSelected: boolean = false;
  public selectedPointSection: PointsSection | undefined;

  constructor(isPointSectionSelected: boolean, selectedPointSection: PointsSection) {
    this.isPointSectionSelected = isPointSectionSelected;
    this.selectedPointSection = selectedPointSection;
  }
}
