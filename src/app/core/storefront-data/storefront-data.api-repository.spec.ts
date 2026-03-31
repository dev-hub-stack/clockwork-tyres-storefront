import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BusinessSessionService,
  STOREFRONT_AUTH_API_ENDPOINTS
} from '../auth';
import { StorefrontBootstrapService } from '../storefront-bootstrap';
import { ApiStorefrontDataRepository } from './storefront-data.api-repository';

describe('ApiStorefrontDataRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
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
        }
      ]
    });
  });

  it('hydrates catalog items from the backend contract for an authenticated business account', async () => {
    const repository = TestBed.inject(ApiStorefrontDataRepository);
    const bootstrap = TestBed.inject(StorefrontBootstrapService);
    const businessSession = TestBed.inject(BusinessSessionService);
    const http = TestBed.inject(HttpTestingController);

    businessSession.save({
      access_token: 'token-123',
      token_type: 'Bearer',
      owner: {
        id: 1,
        name: 'Owner',
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

    bootstrap.setEndpoints({
      bootstrap: '/api/storefront/bootstrap',
      account_context: '/api/account-context',
      account_context_select: '/api/account-context/select',
      catalog: '/api/storefront/catalog/tyres',
      product_detail: '/api/storefront/catalog/tyres/{slug}',
      search_sizes: '/api/search-sizes',
      search_vehicles: '/api/search-vehicles'
    });
    bootstrap.setAccountContext({
      accountId: 17,
      accountName: 'Alpha Tyres',
      accountType: 'both',
      retailEnabled: true,
      wholesaleEnabled: true,
      subscriptionLabel: 'Premium',
      reportsEnabled: false,
      reportsCustomerLimit: null,
      enabledCategories: ['tyres']
    });

    const hydration = repository.hydrateCatalog('retail-store', 'tyres', 17, {
      width: '245',
      aspectRatio: '35',
      rimSize: '20'
    });

    const request = http.expectOne((candidate) => (
      candidate.url === '/api/storefront/catalog/tyres'
      && candidate.params.get('mode') === 'retail-store'
      && candidate.params.get('category') === 'tyres'
      && candidate.params.get('width') === '245'
      && candidate.params.get('aspectRatio') === '35'
      && candidate.params.get('rimSize') === '20'
    ));

    request.flush({
      status: true,
      data: {
        items: [
          {
            group_id: 1,
            sku: 'TYR-GRP-000001',
            slug: 'michelin-pilot-sport-4s-245-35r20-2026',
            brand: 'Michelin',
            model: 'Pilot Sport 4S',
            subtitle: 'Summer tyre • France • DOT 2026',
            category: 'tyres',
            size: '245/35R20',
            price: 390,
            compare_at_price: null,
            image: null,
            availability: {
              origin: 'own',
              label: 'in stock',
              quantity: 0,
              show_quantity: false,
              supplier_count: 1
            },
            mode_availability: {
              retail_store: true,
              supplier_preview: true
            },
            featured: true
          }
        ],
        meta: {
          mode: 'retail-store',
          category: 'tyres',
          item_count: 1,
          account_slug: 'alpha-tyres'
        }
      }
    });

    await hydration;
    http.verify();

    const items = repository.getCatalogItems('retail-store', 'tyres');

    expect(items).toHaveLength(1);
    expect(items[0].slug).toBe('michelin-pilot-sport-4s-245-35r20-2026');
    expect(items[0].image).toBe('/assets/img/tire-go.jpg');
    expect(items[0].availability.origin).toBe('own');
  });

  it('hydrates PDP payloads from the backend contract', async () => {
    const repository = TestBed.inject(ApiStorefrontDataRepository);
    const bootstrap = TestBed.inject(StorefrontBootstrapService);
    const businessSession = TestBed.inject(BusinessSessionService);
    const http = TestBed.inject(HttpTestingController);

    businessSession.save({
      access_token: 'token-123',
      token_type: 'Bearer',
      owner: {
        id: 1,
        name: 'Owner',
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

    bootstrap.setEndpoints({
      bootstrap: '/api/storefront/bootstrap',
      account_context: '/api/account-context',
      account_context_select: '/api/account-context/select',
      catalog: '/api/storefront/catalog/tyres',
      product_detail: '/api/storefront/catalog/tyres/{slug}',
      search_sizes: '/api/search-sizes',
      search_vehicles: '/api/search-vehicles'
    });
    bootstrap.setAccountContext({
      accountId: 17,
      accountName: 'Alpha Tyres',
      accountType: 'both',
      retailEnabled: true,
      wholesaleEnabled: true,
      subscriptionLabel: 'Premium',
      reportsEnabled: false,
      reportsCustomerLimit: null,
      enabledCategories: ['tyres']
    });

    const hydration = repository.hydrateProduct(
      'michelin-pilot-sport-4s-245-35r20-2026',
      'retail-store',
      'tyres',
      17
    );

    const request = http.expectOne((candidate) => (
      candidate.url === '/api/storefront/catalog/tyres/michelin-pilot-sport-4s-245-35r20-2026'
      && candidate.params.get('mode') === 'retail-store'
      && candidate.params.get('category') === 'tyres'
    ));

    request.flush({
      status: true,
      data: {
        product: {
          group_id: 1,
          sku: 'TYR-GRP-000001',
          slug: 'michelin-pilot-sport-4s-245-35r20-2026',
          brand: 'Michelin',
          model: 'Pilot Sport 4S',
          subtitle: 'Summer tyre • France • DOT 2026',
          category: 'tyres',
          size: '245/35R20',
          price: 390,
          compare_at_price: null,
          image: null,
          availability: {
            origin: 'own',
            label: 'in stock',
            quantity: 0,
            show_quantity: false,
            supplier_count: 1
          },
          mode_availability: {
            retail_store: true,
            supplier_preview: true
          },
          description: 'Clockwork PDP contract',
          gallery: [],
          fits: [],
          specifications: [
            { label: 'Size', value: '245/35R20' }
          ],
          options: [
            {
              sku: 'TYR-GRP-000001',
              slug: 'michelin-pilot-sport-4s-245-35r20-2026',
              size: '245/35R20',
              load_index: '95',
              speed_rating: 'Y',
              season: 'Summer',
              availability: {
                origin: 'own',
                label: 'in stock',
                quantity: 0,
                show_quantity: false,
                supplier_count: 1
              },
              mode_availability: {
                retail_store: true,
                supplier_preview: true
              }
            }
          ],
          related_slugs: []
        }
      }
    });

    await hydration;
    http.verify();

    const product = repository.getProductBySlug(
      'michelin-pilot-sport-4s-245-35r20-2026',
      'retail-store',
      'tyres'
    );

    expect(product?.slug).toBe('michelin-pilot-sport-4s-245-35r20-2026');
    expect(product?.gallery[0]).toBe('/assets/img/tire-go.jpg');
    expect(product?.options[0].loadIndex).toBe('95');
  });
});
