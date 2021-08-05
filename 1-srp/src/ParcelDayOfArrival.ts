import { Dayjs } from 'dayjs';

export enum CalendarDay {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thirsday,
  Friday,
  Saturday,
}

export class ParcelDayOfArrival {
  private readonly shippingDate: Dayjs;
  private arrivalDate: Dayjs;
  private readonly daysOff: CalendarDay[];
  private readonly taxPerDay: number;

  constructor({
    shippingDate,
    daysOff,
    taxPerDay,
  }: {
    shippingDate: Dayjs;
    daysOff: CalendarDay[];
    taxPerDay: number;
  }) {
    this.shippingDate = shippingDate;
    this.arrivalDate = shippingDate;
    this.daysOff = daysOff;
    this.taxPerDay = taxPerDay;
  }

  addBusinessDays(days: number) {
    for (let i = 1; i <= days; ++i) {
      this.addOneDaySkippingWeekend();
    }
  }

  private addOneDaySkippingWeekend() {
    this.arrivalDate = this.arrivalDate.add(1, 'day');
    while (this.isDayOff()) {
      this.arrivalDate = this.arrivalDate.add(1, 'day');
    }
  }

  private isDayOff(): boolean {
    const dayOfWeek = this.arrivalDate.day();
    return this.daysOff.includes(dayOfWeek);
  }

  date(): Dayjs {
    return this.arrivalDate;
  }

  transitTax(): number {
    return this.arrivalDate.diff(this.shippingDate, 'days') * this.taxPerDay;
  }
}
