import dayjs from 'dayjs';
import { CalendarDay, ParcelDayOfArrival } from './ParcelDayOfArrival';

describe('ParcelDayOfArrival - Solution', () => {
  const wednesday1stJanuary2020 = dayjs('2020-01-01T00:00:00Z');
  const weekend = [CalendarDay.Saturday, CalendarDay.Sunday];

  describe('addBusinessDay', () => {
    test('when add some business days then it delays arrival date', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });
      dayOfArrival.addBusinessDays(2);

      expect(dayOfArrival.date()).toEqual({
        day: CalendarDay.Friday,
        date: 'january 3',
      });
    });

    test('when add some business days then skips days off', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });
      dayOfArrival.addBusinessDays(3);

      expect(dayOfArrival.date()).toEqual({
        day: CalendarDay.Monday,
        date: 'january 6',
      });
    });
  });

  describe('countCalendarDaysFrom', () => {
    test('when now is before arrival then count calendar days', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });

      expect(
        dayOfArrival.countCalendarDaysFrom(
          wednesday1stJanuary2020.subtract(12, 'days'),
        ),
      ).toEqual(12);
    });
    test('when now is after arrival then return -1', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });

      expect(
        dayOfArrival.countCalendarDaysFrom(
          wednesday1stJanuary2020.add(12, 'days'),
        ),
      ).toEqual(-1);
    });
  });

  describe('countTransitCalendarDay', () => {
    test('when only business day then count them', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });
      dayOfArrival.addBusinessDays(2);

      expect(dayOfArrival.countTransitCalendarDay()).toEqual(2);
    });
    test('when only over off days then add them', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
      });
      dayOfArrival.addBusinessDays(3);

      expect(dayOfArrival.countTransitCalendarDay()).toEqual(5);
    });
  });
});
