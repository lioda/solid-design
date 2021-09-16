import { Dayjs } from 'dayjs';
import { ParcelDayOfArrival } from './ParcelDayOfArrival';

export class DisplayDayOfArrival {
  constructor(private readonly now: Dayjs) {}

  displayFriendly(dayOfArrival: ParcelDayOfArrival): any {
    const calendarDays = dayOfArrival.countCalendarDaysFrom(this.now);

    if (calendarDays < 0) {
      return 'already delivered';
    }

    const date = dayOfArrival.date();
    if (calendarDays >= 7) {
      return `${date.day} ${date.date}`;
    }
    if (calendarDays >= 2) {
      return `next ${date.day}`;
    }
    if (calendarDays === 1) {
      return 'tomorrow';
    }
    return 'today';
  }
}
