import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
  mapStorefrontBootstrapApiAccountContext,
  normalizeStorefrontBootstrapAccountContext
} from './storefront-bootstrap.helpers';
import {
  STOREFRONT_BOOTSTRAP_API_URL
} from './storefront-bootstrap.tokens';
import { StorefrontBootstrapApiResponse } from './storefront-bootstrap.types';
import { StorefrontBootstrapService } from './storefront-bootstrap.service';

@Injectable({
  providedIn: 'root'
})
export class StorefrontBootstrapApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bootstrap = inject(StorefrontBootstrapService);

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

      const accountContext = mapStorefrontBootstrapApiAccountContext(
        response.data.account,
        response.data.categories,
        response.data.category_defaults ?? null
      );

      this.bootstrap.setAccountContext(normalizeStorefrontBootstrapAccountContext(accountContext));
    } catch {
      // Graceful fallback: the route-driven bootstrap stays active if the API is unavailable.
    }
  }
}
