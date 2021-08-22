import { AccountingDate, Contract, SellerStatistics } from './SellerStatistics';

export type Seller = {
  id: string;
  name: string;
};

export class Reporter {
  constructor(private readonly toReportSales: { seller: Seller; stats: SellerStatistics }[]) {}

  createReport(prices: Record<Contract, number>, accountingDate: AccountingDate): string {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalProfit = 0;
    const reports = [];
    //this.toReportSales.map((sellerSales) => {
    for (const sellerSales of this.toReportSales) {
      const income = sellerSales.stats.income(prices, accountingDate);
      totalIncome += income;
      const expenses = sellerSales.stats.expenses(accountingDate);
      totalExpenses += expenses;
      const profit = sellerSales.stats.profit(prices, accountingDate);
      totalProfit += profit;

      const sellerReport = { name: sellerSales.seller.name, income, expenses, profit };
      reports.push(sellerReport);
    }

    // });
    const report = {
      reports: reports.map((report) => ({
        name: report.name,
        incomeRatio: report.income / totalIncome,
        expensesRatio: report.expenses / totalExpenses,
        profit: report.profit,
      })),
      totalIncome,
      totalExpenses,
      totalProfit,
    };
    return JSON.stringify(report);
  }
  // addReportLine(income: number, expenses: number, profit: number): void {}
}
