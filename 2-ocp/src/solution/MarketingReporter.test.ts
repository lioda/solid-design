import { MarketingReporter } from './MarketingReporter';
import { AccountingDate, SellerStatistics, Product } from './SellerStatistics';

describe('MarketingReporter', () => {
  const tom = { id: 'seller01', name: 'Tom' };
  const jerry = { id: 'seller02', name: 'Jerry' };
  const currentMonth = new AccountingDate(9, 2021);

  function stats(statistics: Partial<Record<Product, number>>): SellerStatistics {
    const stats = new SellerStatistics({ expenses: [], sales: [] });
    jest.spyOn(stats, 'countProduct').mockImplementation((p) => statistics[p] || 0);
    return stats;
  }

  it('should generate a JSON with product report', () => {
    const reporter = new MarketingReporter([
      { seller: tom, stats: stats({ [Product.A]: 47, [Product.C]: 25 }) },
      { seller: jerry, stats: stats({ [Product.A]: 40, [Product.B]: 12 }) },
    ]);

    expect(reporter.createReport(currentMonth).toJson()).toEqual(
      JSON.stringify({
        [Product.A]: 87,
        [Product.B]: 12,
        [Product.C]: 25,
      }),
    );
  });
});
