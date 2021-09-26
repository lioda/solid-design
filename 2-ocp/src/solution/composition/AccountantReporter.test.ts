import { ManagementReporter } from './ManagementReporter';
import { AccountingDate, SellerStatistics } from '../SellerStatistics';
import { AccountantReporter } from './AccountantReporter';
import { HRStatistics } from './Reporter';

describe('ManagementReporter', () => {
  const tom = { name: () => 'Tom' };
  const jerry = { name: () => 'Jerry' };
  const spike = { name: () => 'Spike' };
  const currentMonth = new AccountingDate(9, 2021);
  const prices: any = {};

  function stats({ expenses }: { expenses: number }): HRStatistics {
    const stats = new SellerStatistics({ expenses: [], sales: [] });
    jest.spyOn(stats, 'expenses').mockReturnValue(expenses);
    return stats;
  }

  it('should generate a JSON with all data from all sellers', () => {
    const reporter = new AccountantReporter(
      [
        { employee: tom, stats: stats({ expenses: 75 }) },
        { employee: jerry, stats: stats({ expenses: 25 }) },
        { employee: spike, stats: stats({ expenses: 60 }) },
      ],
      prices,
    );

    expect(reporter.createReport(currentMonth).toJson()).toEqual(
      JSON.stringify({
        reports: [
          { name: 'Tom', values: { expensesRatio: 0.46875 } },
          { name: 'Jerry', values: { expensesRatio: 0.15625 } },
          { name: 'Spike', values: { expensesRatio: 0.375 } },
        ],
        totals: { totalExpenses: 160 },
      }),
    );
  });
});
