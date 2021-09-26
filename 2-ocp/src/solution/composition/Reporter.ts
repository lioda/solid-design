import { AccountingDate, Product } from '../SellerStatistics';

export interface Report {
  toJson(): string;
}

export interface HRStatistics {
  expenses(accountingDate: AccountingDate): number;
  countProduct(product: Product, accountingDate: AccountingDate): number;

  profit(prices: Record<Product, number>, accountingDate: AccountingDate): number;

  income(prices: Record<Product, number>, accountingDate: AccountingDate): number;
}

// export type Sales = { employee: Employee; stats: SellerStatistics }[];
export type HumanResources = { employee: Employee; stats: HRStatistics }[];

export type Employee = {
  name(): string;
};

export interface Reporter {
  createReport(accountingDate: AccountingDate): Report;
}
