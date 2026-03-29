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

    store.setCategories([
      {
        id: 'tyres',
        label: 'Tyres',
        enabled: true,
        launch_category: true,
        features: {
          catalog: {
            key: 'catalog',
            mode: 'enabled',
            enabled: true
          }
        },
        search_by_size_fields: [
          { key: 'width', label: 'Width', type: 'number', required: true }
        ],
        search_by_vehicle_fields: [
          { key: 'make', label: 'Make', type: 'select', required: true }
        ],
        spec_fields: ['size']
      },
      {
        id: 'wheels',
        label: 'Wheels',
        enabled: false,
        launch_category: false,
        features: {
          catalog: {
            key: 'catalog',
            mode: 'disabled',
            enabled: false
          }
        },
        search_by_size_fields: [],
        search_by_vehicle_fields: [],
        spec_fields: []
      }
    ], {
      active: 'tyres',
      enabled: ['tyres']
    });

    store.setEndpoints({
      bootstrap: '/api/storefront/bootstrap',
      account_context: '/api/account-context',
      account_context_select: '/api/account-context/select',
      catalog: '/api/products',
      product_detail: '/api/product/{slug}/{sku}',
      search_sizes: '/api/search-sizes',
      search_vehicles: '/api/search-vehicles'
    });

    expect(store.endpoints()).toEqual({
      bootstrap: '/api/storefront/bootstrap',
      account_context: '/api/account-context',
      account_context_select: '/api/account-context/select',
      catalog: '/api/products',
      product_detail: '/api/product/{slug}/{sku}',
      search_sizes: '/api/search-sizes',
      search_vehicles: '/api/search-vehicles'
    });
    expect(store.categories()?.[0].features?.catalog?.enabled).toBe(true);
    expect(store.categoryDefaults()).toEqual({
      active: 'tyres',
      enabled: ['tyres']
    });

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
