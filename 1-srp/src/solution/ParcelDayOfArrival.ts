import { Dayjs } from 'dayjs';
import { Transit } from './TransitTax';

export enum CalendarDay {
  Sunday = 'sunday',
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
}
const dayList = [
  CalendarDay.Sunday,
  CalendarDay.Monday,
  CalendarDay.Tuesday,
  CalendarDay.Wednesday,
  CalendarDay.Thursday,
  CalendarDay.Friday,
  CalendarDay.Saturday,
];

export class ParcelDayOfArrival implements Transit {
  private readonly shippingDate: Dayjs;
  private arrivalDate: Dayjs;
  private readonly daysOff: CalendarDay[];

  constructor({
    shippingDate,
    daysOff,
  }: {
    shippingDate: Dayjs;
    daysOff: CalendarDay[];
  }) {
    this.shippingDate = shippingDate;
    this.arrivalDate = shippingDate;
    this.daysOff = daysOff;
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
    const dayOfWeek = dayList[this.arrivalDate.day()];
    return this.daysOff.includes(dayOfWeek);
  }

  date(): { day: CalendarDay; date: string } {
    const day = dayList[this.arrivalDate.get('day')];
    return {
      day,
      date: this.arrivalDate.format('MMMM D').toLowerCase(),
    };
  }

  countCalendarDaysFrom(date: Dayjs): number {
    const result = this.arrivalDate.diff(date, 'days');
    if (result < 0) {
      return -1;
    }
    return result;
  }

  countTransitCalendarDay(): number {
    return this.countCalendarDaysFrom(this.shippingDate);
  }
}
