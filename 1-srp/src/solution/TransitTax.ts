export interface Transit {
  countTransitCalendarDay(): number;
}

export class TransitTax {
  constructor(private readonly taxPerDay: number) {}

  computeTax(transit: Transit): number {
    return transit.countTransitCalendarDay() * this.taxPerDay;
  }
}
