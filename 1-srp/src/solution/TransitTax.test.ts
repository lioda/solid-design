import { Transit, TransitTax } from './TransitTax';

describe('TransitTax', () => {
  function transitForCalendarDays(days: number): Transit {
    return {
      countTransitCalendarDay: () => days,
    };
  }

  test('when compute transit tax then multiply calendar days by tax', () => {
    const taxPerDay = 1.5;
    const transitDuration = 14;
    const transit = transitForCalendarDays(transitDuration);

    const transitTax = new TransitTax(taxPerDay);
    const tax = transitTax.computeTax(transit);

    expect(tax).toEqual(transitDuration * taxPerDay);
  });
});
