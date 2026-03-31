import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { STOREFRONT_DATA_REPOSITORY } from '../storefront-data';
import {
  BusinessSessionService,
  STOREFRONT_AUTH_API_ENDPOINTS
} from '../auth';
import {
  STOREFRONT_BOOTSTRAP_API_URL,
  StorefrontBootstrapApiService,
  StorefrontBootstrapService
} from './index';

describe('StorefrontBootstrapApiService', () => {
  const storefrontDataRepository = {
    hydrateWorkspace: async () => undefined,
    restoreWorkspaceFallback: () => undefined,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: STOREFRONT_BOOTSTRAP_API_URL, useValue: '/api/storefront/bootstrap' },
        {
          provide: STOREFRONT_AUTH_API_ENDPOINTS,
          useValue: {
            countries: '/api/countries',
            register: '/api/auth/business-register',
            login: '/api/auth/business-login',
            forgot: '/api/auth/forgot',
            accountContext: '/api/account-context',
            accountContextSelect: '/api/account-context/select',
            workspace: '/api/storefront/workspace',
            orders: '/api/storefront/orders'
          }
        },
        { provide: STOREFRONT_DATA_REPOSITORY, useValue: storefrontDataRepository }
      ]
    });
  });

  it('hydrates the bootstrap store from the backend contract', async () => {
    const service = TestBed.inject(StorefrontBootstrapApiService);
    const bootstrap = TestBed.inject(StorefrontBootstrapService);
    const http = TestBed.inject(HttpTestingController);

    const hydration = service.hydrate();

    const request = http.expectOne('/api/storefront/bootstrap');
    request.flush({
      status: true,
      data: {
        version: 1,
        storefront_mode: 'supplier-preview',
        endpoints: {
          bootstrap: '/api/storefront/bootstrap',
          account_context: '/api/account-context',
          account_context_select: '/api/account-context/select',
          catalog: '/api/storefront/catalog/tyres',
          product_detail: '/api/storefront/catalog/tyres/{slug}',
          search_sizes: '/api/search-sizes',
          search_vehicles: '/api/search-vehicles'
        },
        account: {
          id: 17,
          slug: 'alpha-tyres',
          name: 'Alpha Tyres',
          account_type: 'both',
          retail_enabled: true,
          wholesale_enabled: true,
          base_subscription_plan: 'premium',
          reports_subscription_enabled: true,
          reports_customer_limit: 500,
          supported_modes: ['retail-store', 'supplier-preview'],
          supports_retail_storefront: true,
          supports_wholesale_portal: true,
          has_reports_subscription: true
        },
        storefront: {
          cart_enabled: false,
          checkout_enabled: false,
          supplier_identity_hidden: true,
          manual_supplier_selection: true,
          search: {
            by_vehicle: true,
            by_size: true
          }
        },
        categories: [
          {
            id: 'tyres',
            label: 'Tyres',
            enabled: true,
            launch_category: true,
            launch_status: 'live',
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
          }
        ],
        category_defaults: {
          active: 'tyres',
          enabled: ['tyres']
        },
        pricing: {
          levels: ['retail', 'wholesale_lvl1']
        }
      }
    });

    await hydration;
    http.verify();

    expect(bootstrap.endpoints()).toEqual({
      bootstrap: '/api/storefront/bootstrap',
      account_context: '/api/account-context',
      account_context_select: '/api/account-context/select',
      catalog: '/api/storefront/catalog/tyres',
      product_detail: '/api/storefront/catalog/tyres/{slug}',
      search_sizes: '/api/search-sizes',
      search_vehicles: '/api/search-vehicles'
    });
    expect(bootstrap.account()?.accountName).toBe('Alpha Tyres');
    expect(bootstrap.categories()?.[0].launch_category).toBe(true);
    expect(bootstrap.categories()?.[0].features?.catalog?.enabled).toBe(true);
    expect(bootstrap.categoryDefaults()).toEqual({
      active: 'tyres',
      enabled: ['tyres']
    });
    expect(bootstrap.resolved().mode).toBe('retail-store');
    expect(bootstrap.resolved().category).toBe('tyres');
  });

  it('hydrates authenticated account context when a business session exists', async () => {
    const service = TestBed.inject(StorefrontBootstrapApiService);
    const bootstrap = TestBed.inject(StorefrontBootstrapService);
    const businessSession = TestBed.inject(BusinessSessionService);
    const http = TestBed.inject(HttpTestingController);

    businessSession.save({
      access_token: 'token-123',
      token_type: 'Bearer',
      owner: {
        id: 4,
        name: 'Alpha Owner',
        email: 'owner@example.com'
      },
      account_context: {
        selection_source: 'fallback',
        current_account: {
          id: 17,
          name: 'Alpha Tyres',
          slug: 'alpha-tyres',
          account_type: 'both',
          retail_enabled: true,
          wholesale_enabled: true,
          status: 'active'
        },
        available_accounts: []
      }
    });

    const hydration = service.hydrate();

    http.expectOne('/api/storefront/bootstrap').flush({
      status: true,
      data: {
        version: 1,
        storefront_mode: 'retail-store',
        endpoints: {
          bootstrap: '/api/storefront/bootstrap',
          account_context: '/api/account-context',
          account_context_select: '/api/account-context/select',
          catalog: '/api/storefront/catalog/tyres',
          product_detail: '/api/storefront/catalog/tyres/{slug}',
          search_sizes: '/api/search-sizes',
          search_vehicles: '/api/search-vehicles'
        },
        account: null,
        storefront: {
          cart_enabled: true,
          checkout_enabled: true,
          supplier_identity_hidden: true,
          manual_supplier_selection: true,
          search: {
            by_vehicle: true,
            by_size: true
          }
        },
        categories: [
          {
            id: 'tyres',
            label: 'Tyres',
            enabled: true,
            launch_category: true,
            launch_status: 'live',
            features: {
              catalog: {
                key: 'catalog',
                mode: 'enabled',
                enabled: true
              }
            },
            search_by_size_fields: [],
            search_by_vehicle_fields: [],
            spec_fields: ['size']
          }
        ],
        category_defaults: {
          active: 'tyres',
          enabled: ['tyres']
        },
        pricing: {
          levels: ['retail']
        }
      }
    });

    await Promise.resolve();

    http.expectOne('/api/account-context').flush({
      selection_source: 'stored',
      current_account: {
        id: 22,
        name: 'Beta Supply',
        slug: 'beta-supply',
        account_type: 'supplier',
        retail_enabled: false,
        wholesale_enabled: true,
        status: 'active'
      },
      available_accounts: []
    });

    await hydration;
    http.verify();

    expect(bootstrap.account()?.accountId).toBe(22);
    expect(bootstrap.account()?.accountName).toBe('Beta Supply');
    expect(bootstrap.account()?.wholesaleEnabled).toBe(true);
    expect(bootstrap.resolved().mode).toBe('supplier-preview');
    expect(businessSession.session()?.account_context.current_account?.slug).toBe('beta-supply');
  });
});
