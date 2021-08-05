import dayjs from 'dayjs';
import { CalendarDay, ParcelDayOfArrival } from './ParcelDayOfArrival';

describe('ParcelDayOfArrival', () => {
  const wednesday1stJanuary2020 = dayjs('2020-01-01T00:00:00Z');
  const friday3January2020 = dayjs('2020-01-03T00:00:00Z');
  const monday6January2020 = dayjs('2020-01-06T00:00:00Z');
  const weekend = [CalendarDay.Saturday, CalendarDay.Sunday];

  const taxPerDay = 1.5;
  describe('addBusinessDay', () => {
    test('when add some business days then it delays arrival date', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(2);

      expect(dayOfArrival.date()).toEqual(friday3January2020);
    });

    test('when add some business days then skips days off', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(3);

      expect(dayOfArrival.date()).toEqual(monday6January2020);
    });
  });

  describe('transitTax', () => {
    test('when transit on business days then multiply by tax', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(2);

      expect(dayOfArrival.transitTax()).toEqual(2 * taxPerDay);
    });

    test('when transit on weekends then count calendar days for tax', () => {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(3);

      expect(dayOfArrival.transitTax()).toEqual(5 * taxPerDay);
    });
  });
});
