import { ManagementReport, ManagementReporter } from './ManagementReporter';
import { Objective } from './Objective';
import { Report, Sales } from './Reporter';
import { AccountingDate, Product } from './SellerStatistics';

export class AccountantReport implements Report {
  constructor(readonly reports: { name: string; bonus: number }[]) {}
  toJson(): string {
    return JSON.stringify(this);
  }
}

export class AccountantReporter extends ManagementReporter {
  constructor(toReportSales: Sales, prices: Record<Product, number>, private readonly objective: Objective) {
    super(toReportSales, prices);
  }

  createReport(accountingDate: AccountingDate): Report {
    const report = super.createReport(accountingDate) as ManagementReport;
    return new AccountantReport(
      report.reports.map((report) => ({
        name: report.name,
        bonus: this.objective.bonusFor(report.profit),
      })),
    );
  }
}
