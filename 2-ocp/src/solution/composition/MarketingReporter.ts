import { HumanResources, Report, Reporter } from './Reporter';
import { Product, AccountingDate } from '../SellerStatistics';
import { CountProductRule } from './ReporterRules';

export class MarketingReport implements Report {
  constructor(readonly report: Record<Product, number>) {}

  toJson(): string {
    return JSON.stringify(this.report);
  }
}

export class MarketingReporter implements Reporter {
  private readonly rule = new CountProductRule();
  constructor(private readonly toReportSales: HumanResources) {}

  createReport(accountingDate: AccountingDate): Report {
    const report = this.rule.generateReport(accountingDate, this.toReportSales);

    return new MarketingReport({
      [Product.A]: report.totals[Product.A],
      [Product.B]: report.totals[Product.B],
      [Product.C]: report.totals[Product.C],
    });
  }
}
