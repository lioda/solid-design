import { ManagementReporter } from './ManagementReporter';
import { AccountingDate, SellerStatistics } from './SellerStatistics';

describe('Reporter', () => {
  const tom = { id: 'seller01', name: 'Tom' };
  const jerry = { id: 'seller02', name: 'Jerry' };
  const currentMonth = new AccountingDate(9, 2021);
  const prices: any = {};

  function stats({ income, expenses }: { income: number; expenses: number }): SellerStatistics {
    const stats = new SellerStatistics({ expenses: [], sales: [] });
    jest.spyOn(stats, 'income').mockReturnValue(income);
    jest.spyOn(stats, 'expenses').mockReturnValue(expenses);
    jest.spyOn(stats, 'profit').mockReturnValue(income - expenses);
    return stats;
  }

  it('should generate a JSON with all data from all sellers', () => {
    const reporter = new ManagementReporter([
      { seller: tom, stats: stats({ income: 75, expenses: 75 }) },
      { seller: jerry, stats: stats({ income: 125, expenses: 25 }) },
    ]);

    expect(reporter.createReport(prices, currentMonth).toJson()).toEqual(
      JSON.stringify({
        reports: [
          { name: 'Tom', incomeRatio: 0.375, expensesRatio: 0.75, profit: 0 },
          { name: 'Jerry', incomeRatio: 0.625, expensesRatio: 0.25, profit: 100 },
        ],
        totalIncome: 200,
        totalExpenses: 100,
        totalProfit: 100,
      }),
    );
  });
});
