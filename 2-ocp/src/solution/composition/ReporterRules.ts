import { HumanResources } from './Reporter';
import { AccountingDate, Product } from '../SellerStatistics';

export class PartialReport {
  constructor(
    readonly reports: Array<{ name: string; values: Record<string, number> }>,
    readonly totals: Record<string, number>,
  ) {}

  mergeWith(other: PartialReport): PartialReport {
    const allUnicNames = new Set(this.reports.map((r) => r.name).concat(other.reports.map((r) => r.name)));

    const mergedReports = Array.from(allUnicNames.values()).map((name) => {
      const thisReport = this.reports.find((r) => r.name === name);
      const otherReport = other.reports.find((r) => r.name === name);
      return {
        name,
        values: {
          ...thisReport?.values,
          ...otherReport?.values,
        },
      };
    });

    const mergedTotals = { ...this.totals, ...other.totals };

    return new PartialReport(mergedReports, mergedTotals);
  }
}

export interface ReporterRule {
  generateReport(date: AccountingDate, sales: HumanResources, prices: Record<Product, number>): PartialReport;
}

export class IncomeRule implements ReporterRule {
  generateReport(
    accountingDate: AccountingDate,
    sales: HumanResources,
    prices: Record<Product, number>,
  ): PartialReport {
    const reports = [];
    let totalIncome = 0;
    for (const sellerSales of sales) {
      const income = sellerSales.stats.income(prices, accountingDate);
      totalIncome += income;

      reports.push({ name: sellerSales.employee.name(), income });
    }

    return new PartialReport(
      reports.map((r) => ({ name: r.name, values: { incomeRatio: r.income / totalIncome } })),
      { totalIncome: totalIncome },
    );
  }
}

export class ExpensesRule implements ReporterRule {
  generateReport(
    accountingDate: AccountingDate,
    sales: HumanResources,
    _prices: Record<Product, number>,
  ): PartialReport {
    const reports = [];
    let totalExpenses = 0;
    for (const sellerSales of sales) {
      const cost = sellerSales.stats.expenses(accountingDate);
      totalExpenses += cost;

      reports.push({ name: sellerSales.employee.name(), cost });
    }

    return new PartialReport(
      reports.map((r) => ({ name: r.name, values: { expensesRatio: r.cost / totalExpenses } })),
      { totalExpenses: totalExpenses },
    );
  }
}

export class ProfitRule implements ReporterRule {
  generateReport(
    accountingDate: AccountingDate,
    sales: HumanResources,
    prices: Record<Product, number>,
  ): PartialReport {
    const reports = [];
    let totalProfit = 0;
    for (const sellerSales of sales) {
      const income = sellerSales.stats.income(prices, accountingDate);
      const expenses = sellerSales.stats.expenses(accountingDate);
      const profit = income - expenses;
      totalProfit += profit;

      reports.push({ name: sellerSales.employee.name(), values: { profit } });
    }

    return new PartialReport(reports, {
      totalProfit: totalProfit,
    });
  }
}

export class CountProductRule implements ReporterRule {
  generateReport(accountingDate: AccountingDate, sales: HumanResources): PartialReport {
    const allProducts = [Product.A, Product.B, Product.C];
    const totals: Record<Product, number> = { [Product.A]: 0, [Product.B]: 0, [Product.C]: 0 };
    for (const sellerSales of sales) {
      for (const product of allProducts) {
        const count = sellerSales.stats.countProduct(product, accountingDate);
        totals[product] += count;
      }
    }

    return new PartialReport(
      sales.map((s) => ({ name: s.employee.name(), values: {} })),
      totals,
    );
  }
}

export class CompositeRule implements ReporterRule {
  constructor(private readonly rules: ReporterRule[]) {}

  generateReport(date: AccountingDate, sales: HumanResources, prices: Record<Product, number>): PartialReport {
    let report: PartialReport = new PartialReport([], {});
    for (const rule of this.rules) {
      report = report.mergeWith(rule.generateReport(date, sales, prices));
    }
    return report;
  }
}
