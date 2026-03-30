import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BusinessSessionService } from '../auth';
import { CatalogCategoryId } from '../catalog-categories';
import { FitmentSearchQuery } from '../fitment';
import { StorefrontMode } from './storefront-data.models';
import {
  StorefrontCatalogApiListResponse,
  StorefrontCatalogApiProductResponse
} from './storefront-catalog.api.types';
import { StorefrontBootstrapService } from '../storefront-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class StorefrontCatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly bootstrap = inject(StorefrontBootstrapService);
  private readonly businessSession = inject(BusinessSessionService);

  hasAuthenticatedSession(): boolean {
    return Boolean(this.businessSession.accessToken());
  }

  async fetchCatalog(
    mode: StorefrontMode,
    category: CatalogCategoryId,
    searchQuery: FitmentSearchQuery = {}
  ): Promise<StorefrontCatalogApiListResponse['data'] | null> {
    const endpoint = this.bootstrap.endpoints()?.catalog;

    if (!endpoint || !this.hasAuthenticatedSession()) {
      return null;
    }

    const response = await firstValueFrom(
      this.http.get<StorefrontCatalogApiListResponse>(endpoint, {
        params: {
          mode,
          category,
          ...searchQuery
        }
      })
    );

    if (!response.status || !response.data) {
      return null;
    }

    return response.data;
  }

  async fetchProduct(
    slug: string,
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): Promise<StorefrontCatalogApiProductResponse['data'] | null> {
    const endpointTemplate = this.bootstrap.endpoints()?.product_detail;

    if (!endpointTemplate || !this.hasAuthenticatedSession()) {
      return null;
    }

    const endpoint = endpointTemplate
      .replace('{slug}', encodeURIComponent(slug))
      .replace('{sku}', encodeURIComponent(slug));

    const response = await firstValueFrom(
      this.http.get<StorefrontCatalogApiProductResponse>(endpoint, {
        params: {
          mode,
          category
        }
      })
    );

    if (!response.status || !response.data) {
      return null;
    }

    return response.data;
  }
}
