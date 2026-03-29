import { inject, Injectable } from '@angular/core';
import { CatalogCategoryStore } from './catalog-category.store';
import {
  buildCatalogCategoryViewModel,
  getCatalogCategoryConfig,
  getCatalogCategoryFeature,
  getSelectableCatalogCategories,
  hasCatalogCategoryFeature,
  resolveCatalogCategoryId
} from './catalog-category.helpers';
import { CatalogCategoryFeatureKey, CatalogCategoryId } from './catalog-category.types';

@Injectable({
  providedIn: 'root'
})
export class CatalogCategoryService {
  private readonly store = inject(CatalogCategoryStore);

  readonly categoryId = this.store.categoryId;
  readonly activeCategory = this.store.activeCategory;
  readonly selectableCategories = this.store.selectableCategories;

  setCategory(categoryId: CatalogCategoryId | string | null | undefined): void {
    this.store.setCategory(categoryId);
  }

  reset(): void {
    this.store.reset();
  }

  resolveCategoryId(categoryId: CatalogCategoryId | string | null | undefined): CatalogCategoryId {
    return resolveCatalogCategoryId(categoryId);
  }

  getCategory(categoryId?: CatalogCategoryId | string | null | undefined) {
    return getCatalogCategoryConfig(categoryId ?? this.categoryId());
  }

  getCategoryViewModel(categoryId?: CatalogCategoryId | string | null | undefined) {
    return buildCatalogCategoryViewModel(categoryId ?? this.categoryId());
  }

  getFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ) {
    return getCatalogCategoryFeature(categoryId ?? this.categoryId(), featureKey);
  }

  hasFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ): boolean {
    return hasCatalogCategoryFeature(categoryId ?? this.categoryId(), featureKey);
  }

  getSelectableCategories() {
    return getSelectableCatalogCategories();
  }
}
