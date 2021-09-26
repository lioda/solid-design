import { Reporter } from './Reporter';
import { AccountingDate, Product } from './SellerStatistics';

interface ReportRepository {
  save(report: string): void;
}

export class ReportSavingUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  saveReport(reporter: Reporter, date: AccountingDate) {
    const report = reporter.createReport(date);

    this.reportRepository.save(report.toJson());
  }
}
