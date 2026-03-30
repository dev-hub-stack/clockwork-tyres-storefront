import { inject, Injectable } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import { StorefrontBootstrapService } from '../storefront-bootstrap';
import { StorefrontMode } from './storefront-data.models';
import { ApiStorefrontDataRepository } from './storefront-data.api-repository';

@Injectable({
  providedIn: 'root'
})
export class StorefrontCatalogSyncService {
  private readonly bootstrap = inject(StorefrontBootstrapService);
  private readonly repository = inject(ApiStorefrontDataRepository);

  async syncCatalog(mode: StorefrontMode, category: CatalogCategoryId): Promise<void> {
    const accountId = this.bootstrap.account()?.accountId ?? null;

    await this.repository.hydrateCatalog(mode, category, accountId);
  }

  async syncProduct(
    slug: string,
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): Promise<void> {
    const accountId = this.bootstrap.account()?.accountId ?? null;

    await this.repository.hydrateProduct(slug, mode, category, accountId);
  }
}
