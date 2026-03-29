import { TestBed } from '@angular/core/testing';
import { CatalogCategoryStore } from './catalog-category.store';
import { StorefrontBootstrapService } from '../storefront-bootstrap';

describe('CatalogCategoryStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('hydrates category config from the backend bootstrap contract', () => {
    const bootstrap = TestBed.inject(StorefrontBootstrapService);
    const store = TestBed.inject(CatalogCategoryStore);

    bootstrap.setCategories([
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

    bootstrap.setAccountContext({
      accountId: 10,
      accountName: 'Alpha Tyres',
      accountType: 'both',
      retailEnabled: true,
      wholesaleEnabled: true,
      subscriptionLabel: 'premium',
      reportsEnabled: true,
      reportsCustomerLimit: 500,
      enabledCategories: ['tyres']
    });

    store.setCategory('wheels');

    expect(store.categoryId()).toBe('tyres');
    expect(store.activeCategory().id).toBe('tyres');
    expect(store.activeCategory().isSelectable).toBe(true);
    expect(store.selectableCategories().map((category) => category.id)).toEqual(['tyres']);
    expect(store.getFeature('catalog').enabled).toBe(true);
  });
});
