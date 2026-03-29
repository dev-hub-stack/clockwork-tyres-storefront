import { StorefrontBootstrapStore } from './storefront-bootstrap.store';

describe('StorefrontBootstrapStore', () => {
  it('resolves route-driven launch state and supports account context overrides', () => {
    const store = new StorefrontBootstrapStore();

    store.syncFromRouteState({
      category: 'wheels',
      fitmentMode: 'search-by-vehicle',
      storefrontMode: 'supplier-preview',
      query: {
        category: 'wheels'
      },
      initialized: true
    });

    expect(store.isReady()).toBe(true);
    expect(store.mode()).toBe('supplier-preview');
    expect(store.category()).toBe('wheels');
    expect(store.fitmentMode()).toBe('search-by-vehicle');
    expect(store.source()).toBe('route');

    store.setAccountContext({
      accountId: 44,
      accountName: 'Alpha Tyres',
      accountType: 'both',
      retailEnabled: true,
      wholesaleEnabled: true,
      subscriptionLabel: 'premium',
      reportsEnabled: true,
      reportsCustomerLimit: 500,
      enabledCategories: ['tyres']
    });

    expect(store.resolved().accountLabel).toBe('Alpha Tyres');
    expect(store.category()).toBe('tyres');
    expect(store.modeContext()).toEqual({
      accountId: 44,
      accountName: 'Alpha Tyres',
      supplierId: 44,
      supplierName: 'Alpha Tyres'
    });
  });
});
