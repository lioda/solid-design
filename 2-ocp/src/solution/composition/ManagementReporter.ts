import { HumanResources, Report, Reporter } from './Reporter';
import { AccountingDate, Product } from '../SellerStatistics';
import { CompositeRule, ExpensesRule, IncomeRule, PartialReport, ProfitRule } from './ReporterRules';

export class ManagementReport implements Report {
  constructor(
    readonly reports: {
      name: string;
      values: { incomeRatio: number; expensesRatio: number; profit: number };
    }[],
    readonly totals: {
      totalIncome: number;
      totalExpenses: number;
      totalProfit: number;
    },
  ) {}

  toJson() {
    return JSON.stringify(this);
  }
}

export class ManagementReporter implements Reporter {
  private readonly rules = new CompositeRule([new IncomeRule(), new ExpensesRule(), new ProfitRule()]);
  constructor(private readonly toReportSales: HumanResources, private readonly prices: Record<Product, number>) {}

  createReport(accountingDate: AccountingDate): Report {
    const report = this.rules.generateReport(accountingDate, this.toReportSales, this.prices);

    return this.buildReport(report);
  }

  private buildReport(report: PartialReport) {
    const result = new ManagementReport(
      report.reports.map((r) => ({
        name: r.name,
        values: {
          incomeRatio: r.values.incomeRatio,
          expensesRatio: r.values.expensesRatio,
          profit: r.values.profit,
        },
      })),
      {
        totalIncome: report.totals.totalIncome,
        totalExpenses: report.totals.totalExpenses,
        totalProfit: report.totals.totalProfit,
      },
    );

    return result;
  }
}
