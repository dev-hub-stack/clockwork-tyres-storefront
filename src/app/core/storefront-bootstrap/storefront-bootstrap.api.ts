import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
  BusinessAccountContext,
  BusinessSessionService,
  STOREFRONT_AUTH_API_ENDPOINTS
} from '../auth';
import {
  mapStorefrontBootstrapApiAccountContext,
  normalizeStorefrontBootstrapApiCategories,
  normalizeStorefrontBootstrapApiCategoryDefaults,
  normalizeStorefrontBootstrapApiEndpoints,
  normalizeStorefrontBootstrapAccountContext
} from './storefront-bootstrap.helpers';
import {
  STOREFRONT_BOOTSTRAP_API_URL
} from './storefront-bootstrap.tokens';
import { StorefrontBootstrapApiResponse } from './storefront-bootstrap.types';
import { StorefrontBootstrapService } from './storefront-bootstrap.service';
import {
  STOREFRONT_DATA_REPOSITORY,
  StorefrontDataRepository
} from '../storefront-data';

@Injectable({
  providedIn: 'root'
})
export class StorefrontBootstrapApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bootstrap = inject(StorefrontBootstrapService);
  private readonly businessSession = inject(BusinessSessionService);
  private readonly authEndpoints = inject(STOREFRONT_AUTH_API_ENDPOINTS);
  private readonly storefrontDataRepository: StorefrontDataRepository = inject(STOREFRONT_DATA_REPOSITORY);

  constructor(
    @Inject(STOREFRONT_BOOTSTRAP_API_URL) private readonly bootstrapUrl: string
  ) {
  }

  async hydrate(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<StorefrontBootstrapApiResponse>(this.bootstrapUrl)
      );

      if (!response?.status || !response.data) {
        return;
      }

      this.bootstrap.setEndpoints(
        normalizeStorefrontBootstrapApiEndpoints(response.data.endpoints ?? null)
      );

      this.bootstrap.setCategories(
        normalizeStorefrontBootstrapApiCategories(response.data.categories ?? null),
        normalizeStorefrontBootstrapApiCategoryDefaults(response.data.category_defaults ?? null)
      );

      const accountContext = mapStorefrontBootstrapApiAccountContext(
        response.data.account,
        response.data.categories,
        response.data.category_defaults ?? null
      );

      this.bootstrap.setAccountContext(normalizeStorefrontBootstrapAccountContext(accountContext));
    } catch {
      // Graceful fallback: the route-driven bootstrap stays active if the API is unavailable.
    }

    await this.hydrateAuthenticatedAccountContext(this.businessSession.session()?.account_context ?? null);
  }

  async hydrateAuthenticatedAccountContext(
    seedContext: BusinessAccountContext | null = null
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.businessSession.accessToken()) {
      this.storefrontDataRepository.restoreWorkspaceFallback();
      return;
    }

    if (seedContext) {
      this.bootstrap.setAccountContext(this.mapBusinessAccountContext(seedContext));
    }

    try {
      const response = await firstValueFrom(
        this.http.get<BusinessAccountContext>(this.authEndpoints.accountContext)
      );

      this.businessSession.updateAccountContext(response);
      this.bootstrap.setAccountContext(this.mapBusinessAccountContext(response));
      await this.storefrontDataRepository.hydrateWorkspace(response.current_account?.id ?? null);
    } catch (error) {
      if (error instanceof HttpErrorResponse && [401, 403].includes(error.status)) {
        this.businessSession.clear();
        this.bootstrap.setAccountContext(null);
        this.storefrontDataRepository.restoreWorkspaceFallback();
      }
    }
  }

  private mapBusinessAccountContext(
    context: BusinessAccountContext | null
  ) {
    const currentAccount = context?.current_account;

    if (!currentAccount) {
      return null;
    }

    return normalizeStorefrontBootstrapAccountContext(
      mapStorefrontBootstrapApiAccountContext(
        {
          id: currentAccount.id,
          slug: currentAccount.slug,
          name: currentAccount.name,
          account_type: currentAccount.account_type,
          retail_enabled: currentAccount.retail_enabled,
          wholesale_enabled: currentAccount.wholesale_enabled,
          base_subscription_plan: null,
          reports_subscription_enabled: false,
          reports_customer_limit: null
        },
        this.bootstrap.categories() ?? [],
        this.bootstrap.categoryDefaults()
      )
    );
  }
}
