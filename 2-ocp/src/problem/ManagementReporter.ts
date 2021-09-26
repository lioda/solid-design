import { AccountingDate, Product, SellerStatistics } from './SellerStatistics';

export interface Report {
  toJson(): string;
}

class ManagementReport implements Report {
  constructor(
    private readonly reports: {
      name: string;
      incomeRatio: number;
      expensesRatio: number;
      profit: number;
    }[],
    private readonly totalIncome: number,
    private readonly totalExpenses: number,
    private readonly totalProfit: number,
  ) {}

  toJson() {
    return JSON.stringify(this);
  }
}

export type Sales = { seller: Seller; stats: SellerStatistics }[];

export type Seller = {
  id: string;
  name: string;
};

export class ManagementReporter {
  constructor(private readonly toReportSales: Sales) {}

  createReport(prices: Record<Product, number>, accountingDate: AccountingDate): ManagementReport {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalProfit = 0;
    const reports = [];

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

    const report = new ManagementReport(
      reports.map((report) => ({
        name: report.name,
        incomeRatio: report.income / totalIncome,
        expensesRatio: report.expenses / totalExpenses,
        profit: report.profit,
      })),
      totalIncome,
      totalExpenses,
      totalProfit,
    );

    return report;
  }
}
