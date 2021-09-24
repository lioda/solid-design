import { ManagementReporter } from './ManagementReporter';
import { AccountingDate, Product, SellerStatistics } from './SellerStatistics';

describe('SalesStatistics', () => {
  const productAIncome = 100;
  const productBIncome = 200;
  const productCIncome = 400;
  // const marketingExpense = 789;

  const prices = {
    [Product.A]: productAIncome,
    [Product.B]: productBIncome,
    [Product.C]: productCIncome,
  };
  const expenses = {
    marketing: 250,
    transport: 400,
    meals: 120,
  };
  const currentMonth: AccountingDate = new AccountingDate(9, 2021);
  const nextMonth: AccountingDate = new AccountingDate(10, 2021);
  const previousMonth: AccountingDate = new AccountingDate(8, 2021);

  // type FakeReporter = Reporter & { income: number; expenses: number; profit: number };
  // function fakeReporter(): FakeReporter {
  //   return {
  //     income: 0,
  //     expenses: 0,
  //     profit: 0,
  //     addReportLine(income: number, expenses: number, profit: number) {
  //       this.income = income;
  //       this.expenses = expenses;
  //       this.profit = profit;
  //     },
  //   };
  // }
  it('should compute stats by counting all when all at same accounting date ', () => {
    const countA = 2;
    const countB = 7;
    const countC = 1;

    const stats = new SellerStatistics({
      expenses: [{ ...expenses, accountingDate: currentMonth }],
      sales: [
        { product: Product.A, count: countA, accountingDate: currentMonth },
        { product: Product.B, count: countB, accountingDate: currentMonth },
        { product: Product.C, count: countC, accountingDate: currentMonth },
      ],
    });

    const expectedIncome = countA * productAIncome + countB * productBIncome + countC * productCIncome;
    const expectedExpenses = expenses.marketing + expenses.meals + expenses.transport;
    expect(stats.expenses(currentMonth)).toBe(expectedExpenses);
    expect(stats.income(prices, currentMonth)).toBe(expectedIncome);
    expect(stats.profit(prices, currentMonth)).toBe(expectedIncome - expectedExpenses);
    expect(stats.activity()).toEqual([currentMonth]);
  });

  it('should compute stats only for given accounting date', () => {
    const countA = 2;
    const countB = 7;
    const countC = 1;

    const stats = new SellerStatistics({
      expenses: [{ ...expenses, accountingDate: previousMonth }],
      sales: [
        { product: Product.A, count: countA, accountingDate: previousMonth },
        { product: Product.B, count: countB, accountingDate: currentMonth },
        { product: Product.C, count: countC, accountingDate: nextMonth },
      ],
    });

    const expectedIncome = countB * productBIncome;
    const expectedExpenses = 0;
    expect(stats.expenses(currentMonth)).toBe(expectedExpenses);
    expect(stats.income(prices, currentMonth)).toBe(expectedIncome);
    expect(stats.profit(prices, currentMonth)).toBe(expectedIncome - expectedExpenses);
    expect(stats.activity()).toEqual([previousMonth, currentMonth, nextMonth]);
  });

  // it('should report all stats', () => {
  //   const reporter = fakeReporter();
  //   const countA = 9;
  //   const countC = 3;
  //   const stats = new SellerStatistics({
  //     marketingExpense,
  //     sales: [
  //       { contract: Contract.A, count: countA },
  //       { contract: Contract.C, count: countC },
  //     ],
  //   });

  //   stats.reportTo(reporter, prices);

  //   const expectedIncome = countA * contractAIncome + countC * contractCIncome;
  //   expect(reporter).toMatchObject({
  //     income: expectedIncome,
  //     expenses: marketingExpense,
  //     profit: expectedIncome - marketingExpense,
  //   });
  // });
});
