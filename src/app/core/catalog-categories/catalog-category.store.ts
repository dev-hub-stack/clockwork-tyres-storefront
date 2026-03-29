import { Injectable, computed, inject, signal } from '@angular/core';
import { StorefrontBootstrapService } from '../storefront-bootstrap';
import {
  buildCatalogCategoryViewModel,
  buildCatalogCategoryConfigMap,
  getCatalogCategoryFeature,
  getSelectableCatalogCategories,
  resolveCatalogCategoryId
} from './catalog-category.helpers';
import {
  CatalogCategoryFeatureKey,
  CatalogCategoryId,
  CatalogCategoryViewModel
} from './catalog-category.types';

@Injectable({
  providedIn: 'root'
})
export class CatalogCategoryStore {
  private readonly bootstrap = inject(StorefrontBootstrapService);
  private readonly categoryIdState = signal<CatalogCategoryId>('tyres');
  private readonly configMap = computed(() =>
    buildCatalogCategoryConfigMap(this.bootstrap.categories())
  );
  private readonly allowedCategoryIds = computed(() => this.bootstrap.account()?.enabledCategories ?? null);

  readonly categoryId = this.categoryIdState.asReadonly();
  readonly activeCategory = computed(() =>
    buildCatalogCategoryViewModel(this.categoryId(), this.configMap(), this.allowedCategoryIds())
  );
  readonly selectableCategories = computed(() =>
    getSelectableCatalogCategories(this.configMap(), this.allowedCategoryIds())
  );

  setCategory(categoryId: CatalogCategoryId | string | null | undefined): void {
    this.categoryIdState.set(
      resolveCatalogCategoryId(categoryId, this.configMap(), this.allowedCategoryIds())
    );
  }

  reset(): void {
    this.categoryIdState.set(
      resolveCatalogCategoryId(null, this.configMap(), this.allowedCategoryIds())
    );
  }

  getCategory(categoryId?: CatalogCategoryId | string | null | undefined): CatalogCategoryViewModel {
    return buildCatalogCategoryViewModel(
      categoryId ?? this.categoryId(),
      this.configMap(),
      this.allowedCategoryIds()
    );
  }

  resolveCategoryId(categoryId: CatalogCategoryId | string | null | undefined): CatalogCategoryId {
    return resolveCatalogCategoryId(categoryId, this.configMap(), this.allowedCategoryIds());
  }

  getFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ) {
    return getCatalogCategoryFeature(categoryId ?? this.categoryId(), featureKey, this.configMap());
  }

  hasFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ): boolean {
    return this.getFeature(featureKey, categoryId).enabled;
  }
}
