import { Report, Reporter, Sales } from './Reporter';
import { AccountingDate, Product } from './SellerStatistics';

export class ManagementReport implements Report {
  constructor(
    readonly reports: {
      name: string;
      incomeRatio: number;
      expensesRatio: number;
      profit: number;
    }[],
    readonly totalIncome: number,
    readonly totalExpenses: number,
    readonly totalProfit: number,
  ) {}

  toJson() {
    return JSON.stringify(this);
  }
}

export class ManagementReporter implements Reporter {
  constructor(private readonly toReportSales: Sales, private readonly prices: Record<Product, number>) {}

  createReport(accountingDate: AccountingDate): Report {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalProfit = 0;
    const reports = [];

    for (const sellerSales of this.toReportSales) {
      const income = sellerSales.stats.income(this.prices, accountingDate);
      totalIncome += income;
      const expenses = sellerSales.stats.expenses(accountingDate);
      totalExpenses += expenses;
      const profit = sellerSales.stats.profit(this.prices, accountingDate);
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
