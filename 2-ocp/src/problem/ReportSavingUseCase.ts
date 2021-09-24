import { Report, ManagementReporter, Sales } from './ManagementReporter';
import { AccountingDate, Product } from './SellerStatistics';

interface PriceRepository {
  loadPrices(date: AccountingDate): Record<Product, number>;
}

interface ReportRepository {
  save(report: string): void;
}

export class ReportSavingUseCase {
  constructor(private readonly priceRepository: PriceRepository, private readonly reportRepository: ReportRepository) {}

  saveReport(date: AccountingDate, sales: Sales) {
    const prices = this.priceRepository.loadPrices(date);

    const report = new ManagementReporter(sales).createReport(prices, date);

    this.reportRepository.save(report.toJson());
  }
}
