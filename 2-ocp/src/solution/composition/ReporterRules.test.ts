import { AccountingDate, Product, SellerStatistics } from '../SellerStatistics';
import {
  ExpensesRule,
  IncomeRule,
  ProfitRule,
  PartialReport,
  CompositeRule,
  ReporterRule,
  CountProductRule,
} from './ReporterRules';

describe('ReporterRules', () => {
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

  describe('IncomeRule', () => {
    it('should fill each seller income ratio and produce totalIncome value', () => {
      const rule = new IncomeRule();
      const report = rule.generateReport(
        currentMonth,
        [
          { employee: tom, stats: stats({ income: 75, expenses: 75 }) },
          { employee: jerry, stats: stats({ income: 125, expenses: 25 }) },
        ],
        prices,
      );

      expect(report).toEqual(
        new PartialReport(
          [
            { name: 'Tom', values: { incomeRatio: 0.375 } },
            { name: 'Jerry', values: { incomeRatio: 0.625 } },
          ],
          { totalIncome: 200 },
        ),
      );
    });
  });

  describe('ExpensesRule', () => {
    it('should fill each seller expenses ratio and produce totalExpenses value', () => {
      const rule = new ExpensesRule();
      const report = rule.generateReport(
        currentMonth,
        [
          { employee: tom, stats: stats({ income: 75, expenses: 75 }) },
          { employee: jerry, stats: stats({ income: 125, expenses: 25 }) },
        ],
        prices,
      );

      expect(report).toEqual(
        new PartialReport(
          [
            { name: 'Tom', values: { expensesRatio: 0.75 } },
            { name: 'Jerry', values: { expensesRatio: 0.25 } },
          ],
          { totalExpenses: 100 },
        ),
      );
    });
  });

  describe('ProfitRule', () => {
    it('should fill each seller profit and produce totalProfit value', () => {
      const rule = new ProfitRule();
      const report = rule.generateReport(
        currentMonth,
        [
          { employee: tom, stats: stats({ income: 75, expenses: 75 }) },
          { employee: jerry, stats: stats({ income: 125, expenses: 25 }) },
        ],
        prices,
      );

      expect(report).toEqual(
        new PartialReport(
          [
            { name: 'Tom', values: { profit: 0 } },
            { name: 'Jerry', values: { profit: 100 } },
          ],
          { totalProfit: 100 },
        ),
      );
    });
  });

  describe('CountProductRule', () => {
    function stats(statistics: Partial<Record<Product, number>>): SellerStatistics {
      const stats = new SellerStatistics({ expenses: [], sales: [] });
      jest.spyOn(stats, 'countProduct').mockImplementation((p) => statistics[p] || 0);
      return stats;
    }

    it('should count product in totals', () => {
      const rule = new CountProductRule();
      const report = rule.generateReport(currentMonth, [
        { employee: tom, stats: stats({ [Product.A]: 47, [Product.C]: 25 }) },
        { employee: jerry, stats: stats({ [Product.A]: 40, [Product.B]: 12 }) },
      ]);

      expect(report).toEqual({
        reports: [
          { name: 'Tom', values: {} },
          { name: 'Jerry', values: {} },
        ],
        totals: { [Product.A]: 87, [Product.B]: 12, [Product.C]: 25 },
      });
    });
  });

  describe('PartialReport', () => {
    test('when merge then merge each report values', () => {
      const report1 = new PartialReport(
        [
          { name: 'A', values: { value1: 1, value2: 2 } },
          { name: 'B', values: { value1: 3, value2: 4 } },
        ],
        {},
      );
      const report2 = new PartialReport(
        [
          { name: 'B', values: { value3: 7, value4: 8 } },
          { name: 'A', values: { value3: 5, value4: 6 } },
        ],
        {},
      );

      expect(report1.mergeWith(report2)).toEqual(
        new PartialReport(
          [
            { name: 'A', values: { value1: 1, value2: 2, value3: 5, value4: 6 } },
            { name: 'B', values: { value1: 3, value2: 4, value3: 7, value4: 8 } },
          ],
          {},
        ),
      );
    });

    test('when a report exist in only one PartialReport then add it as is', () => {
      const report1 = new PartialReport(
        [
          { name: 'A', values: { value1: 1, value2: 2 } },
          { name: 'B', values: { value1: 3, value2: 4 } },
        ],
        {},
      );
      const report2 = new PartialReport([{ name: 'C', values: { value3: 5, value4: 6 } }], {});

      expect(report1.mergeWith(report2)).toEqual(
        new PartialReport(
          [
            { name: 'A', values: { value1: 1, value2: 2 } },
            { name: 'B', values: { value1: 3, value2: 4 } },
            { name: 'C', values: { value3: 5, value4: 6 } },
          ],
          {},
        ),
      );
    });

    test('when merge then merge each totals', () => {
      const report1 = new PartialReport([], { totalA: 1, totalB: 2 });
      const report2 = new PartialReport([], { totalC: 3 });

      expect(report1.mergeWith(report2)).toEqual(new PartialReport([], { totalA: 1, totalB: 2, totalC: 3 }));
    });
  });

  describe('CompositeRule', () => {
    test('when generateReport then call generate on composed rules and merge them', () => {
      const report1: PartialReport = new PartialReport([], { A: 0 });
      const report2: PartialReport = new PartialReport([], { B: 1 });
      const report3: PartialReport = new PartialReport([], { C: 2 });
      const rule1: ReporterRule = { generateReport: jest.fn().mockReturnValue(report1) };
      const rule2: ReporterRule = { generateReport: jest.fn().mockReturnValue(report2) };
      const rule3: ReporterRule = { generateReport: jest.fn().mockReturnValue(report3) };
      const sales = [{ employee: tom, stats: stats({ income: 75, expenses: 75 }) }];

      const composite = new CompositeRule([rule1, rule2, rule3]);

      const result = composite.generateReport(currentMonth, sales, prices);

      expect(result).toEqual(report1.mergeWith(report2).mergeWith(report3));

      expect(rule1.generateReport).toHaveBeenCalledWith(currentMonth, sales, prices);
      expect(rule2.generateReport).toHaveBeenCalledWith(currentMonth, sales, prices);
      expect(rule3.generateReport).toHaveBeenCalledWith(currentMonth, sales, prices);
    });
  });
});
