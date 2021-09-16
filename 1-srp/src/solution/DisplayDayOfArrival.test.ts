import dayjs from 'dayjs';
import { DisplayDayOfArrival } from './DisplayDayOfArrival';
import { CalendarDay, ParcelDayOfArrival } from './ParcelDayOfArrival';

describe('displayToCustomer', () => {
  const weekend = [CalendarDay.Saturday, CalendarDay.Sunday];
  function dayOfArrivalFromNow(nowStr: string, arrival: string) {
    const now = dayjs(nowStr);
    const dayOfArrival = new ParcelDayOfArrival({
      shippingDate: dayjs(arrival),
      daysOff: weekend,
    });
    return { dayOfArrival, now };
  }

  test('when arrival is current day then write today', () => {
    const { dayOfArrival, now } = dayOfArrivalFromNow(
      '2020-01-06',
      '2020-01-06',
    );
    const displayDayOfArrival = new DisplayDayOfArrival(now);

    expect(displayDayOfArrival.displayFriendly(dayOfArrival)).toBe('today');
  });

  test('when arrival is in one day then write tomorrow', () => {
    const { dayOfArrival, now } = dayOfArrivalFromNow(
      '2020-01-06',
      '2020-01-07',
    );
    const displayDayOfArrival = new DisplayDayOfArrival(now);

    expect(displayDayOfArrival.displayFriendly(dayOfArrival)).toBe('tomorrow');
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
      const displayDayOfArrival = new DisplayDayOfArrival(now);

      expect(displayDayOfArrival.displayFriendly(dayOfArrival)).toBe(
        `next ${arrivalDay}`,
      );
    },
  );

  test('when arrival is more than two weeks then only write the date', () => {
    const { dayOfArrival, now } = dayOfArrivalFromNow(
      '2020-01-06',
      '2020-01-17',
    );
    const displayDayOfArrival = new DisplayDayOfArrival(now);

    expect(displayDayOfArrival.displayFriendly(dayOfArrival)).toBe(
      'friday january 17',
    );
  });

  test("when arrival is in past then write it's already delivered", () => {
    const { dayOfArrival, now } = dayOfArrivalFromNow(
      '2020-01-17',
      '2020-01-06',
    );
    const displayDayOfArrival = new DisplayDayOfArrival(now);

    expect(displayDayOfArrival.displayFriendly(dayOfArrival)).toBe(
      'already delivered',
    );
  });
});
