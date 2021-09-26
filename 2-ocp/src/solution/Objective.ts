export class Objective {
  constructor(private readonly expectedIncome: number, private readonly amount: number) {}

  bonusFor(actualIncome: number): number {
    if (actualIncome < this.expectedIncome) {
      return 0;
    } else if (actualIncome >= this.expectedIncome * 2) {
      return this.amount * 2;
    }
    return this.amount;
  }
}
