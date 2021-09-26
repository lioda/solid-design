import { SalariesReporter } from './SalariesReporter';
import { Objective } from './Objective';
import { AccountingDate, SellerStatistics } from './SellerStatistics';

describe('SalariesReporter', () => {
  const tom = { id: 'seller01', name: 'Tom' };
  const jerry = { id: 'seller02', name: 'Jerry' };
  const spike = { id: 'seller03', name: 'Spike' };
  const currentMonth = new AccountingDate(9, 2021);
  const bonus = 123;
  const prices: any = {};

  function stats({ income, expenses }: { income: number; expenses: number }): SellerStatistics {
    const stats = new SellerStatistics({ expenses: [], sales: [] });
    jest.spyOn(stats, 'income').mockImplementation((p) => {
      if (p === prices) return income;
      return 0;
    });
    jest.spyOn(stats, 'expenses').mockReturnValue(expenses);
    jest.spyOn(stats, 'profit').mockImplementation((p) => {
      if (p === prices) return income - expenses;
      return 0;
    });
    return stats;
  }

  it('should generate a JSON with product report', () => {
    const reporter = new SalariesReporter(
      [
        { seller: tom, stats: stats({ income: 75, expenses: 75 }) },
        { seller: jerry, stats: stats({ income: 125, expenses: 25 }) },
        { seller: spike, stats: stats({ income: 525, expenses: 25 }) },
      ],
      prices,
      new Objective(100, bonus),
    );

    expect(reporter.createReport(currentMonth).toJson()).toEqual(
      JSON.stringify({
        reports: [
          { name: 'Tom', bonus: 0 },
          { name: 'Jerry', bonus },
          { name: 'Spike', bonus: bonus * 2 },
        ],
      }),
    );
  });
});
