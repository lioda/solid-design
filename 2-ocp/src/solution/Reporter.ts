import { AccountingDate, Product, SellerStatistics } from './SellerStatistics';

export interface Report {
  toJson(): string;
}

export type Sales = { seller: Seller; stats: SellerStatistics }[];

export type Seller = {
  id: string;
  name: string;
};

export interface Reporter {
  createReport(accountingDate: AccountingDate): Report;
}
