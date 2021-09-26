import { Report, Reporter, Sales } from '../Reporter';
import { AccountingDate, Product } from '../SellerStatistics';
import { HumanResources } from './Reporter';
import { ExpensesRule, IncomeRule, ProfitRule } from './ReporterRules';

export class AccountantReport implements Report {
  constructor(
    readonly reports: {
      name: string;
      values: { expensesRatio: number };
    }[],
    readonly totals: {
      totalExpenses: number;
    },
  ) {}

  toJson() {
    return JSON.stringify(this);
  }
}

export class AccountantReporter implements Reporter {
  private readonly rules = [];
  constructor(private readonly humanResources: HumanResources, private readonly prices: Record<Product, number>) {}

  createReport(accountingDate: AccountingDate): Report {
    const report = new ExpensesRule().generateReport(accountingDate, this.humanResources, this.prices);

    return new AccountantReport(
      report.reports.map((r) => ({
        name: r.name,
        values: {
          expensesRatio: r.values.expensesRatio,
        },
      })),
      {
        totalExpenses: report.totals.totalExpenses,
      },
    );
  }
}
