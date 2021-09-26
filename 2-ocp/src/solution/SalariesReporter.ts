import { ManagementReport, ManagementReporter } from './ManagementReporter';
import { Objective } from './Objective';
import { Report, Sales } from './Reporter';
import { AccountingDate, Product } from './SellerStatistics';

export class SalariesReport implements Report {
  constructor(readonly reports: { name: string; bonus: number }[]) {}
  toJson(): string {
    return JSON.stringify(this);
  }
}

export class SalariesReporter extends ManagementReporter {
  constructor(toReportSales: Sales, prices: Record<Product, number>, private readonly objective: Objective) {
    super(toReportSales, prices);
  }

  createReport(accountingDate: AccountingDate): Report {
    const report = super.createReport(accountingDate) as ManagementReport;
    return new SalariesReport(
      report.reports.map((report) => ({
        name: report.name,
        bonus: this.objective.bonusFor(report.profit),
      })),
    );
  }
}
