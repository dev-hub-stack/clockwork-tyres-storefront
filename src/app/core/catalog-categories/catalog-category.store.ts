import { Injectable, computed, signal } from '@angular/core';
import {
  buildCatalogCategoryViewModel,
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
  private readonly categoryIdState = signal<CatalogCategoryId>('tyres');

  readonly categoryId = this.categoryIdState.asReadonly();
  readonly activeCategory = computed(() => buildCatalogCategoryViewModel(this.categoryId()));
  readonly selectableCategories = computed(() => getSelectableCatalogCategories());

  setCategory(categoryId: CatalogCategoryId | string | null | undefined): void {
    this.categoryIdState.set(resolveCatalogCategoryId(categoryId));
  }

  reset(): void {
    this.categoryIdState.set('tyres');
  }

  getCategory(categoryId?: CatalogCategoryId | string | null | undefined): CatalogCategoryViewModel {
    return buildCatalogCategoryViewModel(categoryId ?? this.categoryId());
  }

  hasFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ): boolean {
    return getCatalogCategoryFeature(categoryId ?? this.categoryId(), featureKey).enabled;
  }
}
