import { Report, Reporter, Sales } from './Reporter';
import { Product, AccountingDate } from './SellerStatistics';

export class MarketingReport implements Report {
  constructor(readonly report: Record<Product, number>) {}

  toJson(): string {
    return JSON.stringify(this.report);
  }
}

export class MarketingReporter implements Reporter {
  constructor(private readonly toReportSales: Sales) {}

  createReport(accountingDate: AccountingDate): MarketingReport {
    const result: Record<Product, number> = {
      [Product.A]: 0,
      [Product.B]: 0,
      [Product.C]: 0,
    };

    const allProducts = [Product.A, Product.B, Product.C];

    this.toReportSales.forEach((report) => {
      allProducts.forEach((product) => (result[product] += report.stats.countProduct(product, accountingDate)));
    });

    return new MarketingReport(result);
  }
}
