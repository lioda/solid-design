import dayjs from 'dayjs';
import { CalendarDay, ParcelDayOfArrival } from './ParcelDayOfArrival';

describe('ParcelDayOfArrival - Problem', () => {
  const weekend = [CalendarDay.Saturday, CalendarDay.Sunday];
  const taxPerDay = 1.5;

  describe('addBusinessDay', () => {
    const wednesday1stJanuary2020 = dayjs('2020-01-01T00:00:00Z');
    const friday3January2020 = dayjs('2020-01-03T00:00:00Z');
    const monday6January2020 = dayjs('2020-01-06T00:00:00Z');
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
        arrivalDay: 'monday',
      },
      {
        now: '2020-01-01',
        arrival: '2020-01-07',
        arrivalDay: 'tuesday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-08',
        arrivalDay: 'wednesday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-09',
        arrivalDay: 'thursday',
      },
      {
        now: '2020-01-06',
        arrival: '2020-01-10',
        arrivalDay: 'friday',
      },
    ])(
      'when arrival is at most a week then write next $expected',
      ({
        now: nowStr,
        arrival,
        arrivalDay,
      }: {
        now: string;
        arrival: string;
        arrivalDay: string;
      }) => {
        const { dayOfArrival, now } = dayOfArrivalFromNow(nowStr, arrival);
        expect(dayOfArrival.displayToCustomer(now)).toBe(`next ${arrivalDay}`);
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

  describe('transitTax', () => {
    function shippingDuring({ overWeekend }: { overWeekend: boolean }): {
      dayOfArrival: ParcelDayOfArrival;
      countCalendarDays: number;
    } {
      const dayOfArrival = new ParcelDayOfArrival({
        shippingDate: dayjs('2021-01-13'), // wednesday
        daysOff: weekend,
        taxPerDay,
      });

      let transitDays = 2;
      if (overWeekend) {
        transitDays += 3; // calendar days
        dayOfArrival.addBusinessDays(3);
      } else {
        dayOfArrival.addBusinessDays(2);
      }

      return { dayOfArrival, countCalendarDays: transitDays };
    }

    test('when transit on business days then multiply by tax', () => {
      const { dayOfArrival, countCalendarDays } = shippingDuring({
        overWeekend: false,
      });

      expect(dayOfArrival.transitTax()).toEqual(countCalendarDays * taxPerDay);
    });

    test('when transit on weekends then count calendar days for tax', () => {
      const { dayOfArrival, countCalendarDays } = shippingDuring({
        overWeekend: true,
      });

      expect(dayOfArrival.transitTax()).toEqual(countCalendarDays * taxPerDay);
    });
  });
});
