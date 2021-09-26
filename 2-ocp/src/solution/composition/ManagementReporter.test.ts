import { ManagementReporter } from './ManagementReporter';
import { AccountingDate, SellerStatistics } from '../SellerStatistics';

describe('ManagementReporter', () => {
  const tom = { name: () => 'Tom' };
  const jerry = { name: () => 'Jerry' };
  const currentMonth = new AccountingDate(9, 2021);
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

  it('should generate a JSON with all data from all sellers', () => {
    const reporter = new ManagementReporter(
      [
        { employee: tom, stats: stats({ income: 75, expenses: 75 }) },
        { employee: jerry, stats: stats({ income: 125, expenses: 25 }) },
      ],
      prices,
    );

    expect(reporter.createReport(currentMonth).toJson()).toEqual(
      JSON.stringify({
        reports: [
          { name: 'Tom', values: { incomeRatio: 0.375, expensesRatio: 0.75, profit: 0 } },
          { name: 'Jerry', values: { incomeRatio: 0.625, expensesRatio: 0.25, profit: 100 } },
        ],
        totals: { totalIncome: 200, totalExpenses: 100, totalProfit: 100 },
      }),
    );
  });
});
