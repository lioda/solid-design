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
    //TODO create builders to express more domain in tests
    test('when transit on business days then multiply by tax', () => {
      // BUILDER NEEDED
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(2);
      //

      expect(dayOfArrival.transitTax()).toEqual(2 * taxPerDay);
    });

    test('when transit on weekends then count calendar days for tax', () => {
      // BUILDER NEEDED
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: wednesday1stJanuary2020,
        daysOff: weekend,
        taxPerDay,
      });
      dayOfArrival.addBusinessDays(3);
      //

      expect(dayOfArrival.transitTax()).toEqual(5 * taxPerDay);
    });
  });

  describe('displayToCustomer', () => {
    function dayOfArrivalFromNow(nowStr: string, arrival: string) {
      const now = dayjs(nowStr);
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: dayjs(arrival),
        daysOff: weekend,
        taxPerDay,
      });
      return { dayOfArrival, now };
    }

    test('when arrival is current day then write today', () => {
      const { dayOfArrival, now } = dayOfArrivalFromNow(
        '2020-01-06',
        '2020-01-06',
      );
      expect(dayOfArrival.displayToCustomer(now)).toBe('today');
    });

    test('when arrival is in one day then write tomorrow', () => {
      const { dayOfArrival, now } = dayOfArrivalFromNow(
        '2020-01-06',
        '2020-01-07',
      );
      expect(dayOfArrival.displayToCustomer(now)).toBe('tomorrow');
    });

    test.each([
      {
        now: '2020-01-01',
        arrival: '2020-01-06',
        arrivalDate: 6,
        arrivalDay: 'monday',
      },
      {
        now: '2020-01-01',
        arrival: '2020-01-07',
        arrivalDate: 7,
        arrivalDay: 'tuesday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-08',
        arrivalDate: 8,
        arrivalDay: 'wednesday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-09',
        arrivalDate: 9,
        arrivalDay: 'thursday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-10',
        arrivalDate: 10,
        arrivalDay: 'friday',
      },
    ])(
      'when arrival is at most a week then write next $expected',
      ({
        now: nowStr,
        arrival,
        arrivalDate,
        arrivalDay,
      }: {
        now: string;
        arrival: string;
        arrivalDate: number;
        arrivalDay: string;
      }) => {
        const { dayOfArrival, now } = dayOfArrivalFromNow(nowStr, arrival);
        expect(dayOfArrival.displayToCustomer(now)).toBe(
          `next ${arrivalDay}, january ${arrivalDate}`,
        );
      },
    );

    test('when arrival is more than two weeks then only write the date', () => {
      const { dayOfArrival, now } = dayOfArrivalFromNow(
        '2020-01-06',
        '2020-01-17',
      );
      expect(dayOfArrival.displayToCustomer(now)).toBe(`friday january 17`);
    });
  });
});
