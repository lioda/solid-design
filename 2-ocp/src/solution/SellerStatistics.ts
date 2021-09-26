import { ManagementReporter } from './ManagementReporter';

export enum Product {
  A,
  B,
  C,
}

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Year = number;
export class AccountingDate {
  constructor(private readonly month: Month, private readonly year: Year) {}
  equals(other: AccountingDate) {
    return this.month === other.month && this.year === other.year;
  }
  before(other: AccountingDate) {
    const isPreviousYear = this.year < other.year;
    const isPreviousMonthInSameYear = this.month < other.month && this.year === other.year;
    return isPreviousYear || isPreviousMonthInSameYear;
  }
  after(other: AccountingDate) {
    const isFollowingYear = this.year > other.year;
    const isFollowingMonthInSameYear = this.month > other.month && this.year === other.year;
    return isFollowingYear || isFollowingMonthInSameYear;
  }
  compareTo(other: AccountingDate): number {
    if (this.equals(other)) return 0;
    return this.before(other) ? -1 : 1;
  }
}

export type ProductSale = {
  accountingDate: AccountingDate;
  product: Product;
  count: number;
};

export type Expenses = {
  marketing: number;
  transport: number;
  meals: number;
  accountingDate: AccountingDate;
}[];

export class SellerStatistics {
  sellerExpenses: Expenses;
  sales: ProductSale[];
  constructor({ expenses, sales }: { expenses: Expenses; sales: ProductSale[] }) {
    this.sellerExpenses = expenses;
    this.sales = sales;
  }

  profit(prices: Record<Product, number>, accountingDate: AccountingDate): number {
    const totalIncome = this.income(prices, accountingDate);
    return totalIncome - this.expenses(accountingDate);
  }

  income(prices: Record<Product, number>, accountingDate: AccountingDate): number {
    return this.sales
      .filter((sale) => sale.accountingDate.equals(accountingDate))
      .reduce((income, sale) => income + sale.count * prices[sale.product], 0);
  }
  expenses(accountingDate: AccountingDate): number {
    return this.sellerExpenses
      .filter((expense) => expense.accountingDate.equals(accountingDate))
      .map((expense) => this.totalExpenses(expense))
      .reduce((a, b) => a + b, 0);
  }

  private totalExpenses({
    marketing,
    meals,
    transport,
  }: {
    marketing: number;
    transport: number;
    meals: number;
    accountingDate: AccountingDate;
  }): number {
    return marketing + meals + transport;
  }

  activity(): AccountingDate[] {
    const allAccountingDates = new Set<AccountingDate>();
    this.sales.forEach((sale) => allAccountingDates.add(sale.accountingDate));
    this.sellerExpenses.forEach((expense) => allAccountingDates.add(expense.accountingDate));

    return Array.from(allAccountingDates).sort((a, b) => a.compareTo(b));
  }

  countProduct(product: Product, accountingDate: AccountingDate): number {
    const productSale = this.sales.find((p) => p.product === product && p.accountingDate.equals(accountingDate));
    return productSale?.count || 0;
  }
}
