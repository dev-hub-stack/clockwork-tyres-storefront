import { inject, Injectable } from '@angular/core';
import { CatalogCategoryStore } from './catalog-category.store';
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
    return this.store.resolveCategoryId(categoryId);
  }

  getCategory(categoryId?: CatalogCategoryId | string | null | undefined) {
    return this.store.getCategory(categoryId);
  }

  getCategoryViewModel(categoryId?: CatalogCategoryId | string | null | undefined) {
    return this.store.getCategory(categoryId);
  }

  getFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ) {
    return this.store.getFeature(featureKey, categoryId);
  }

  hasFeature(
    featureKey: CatalogCategoryFeatureKey,
    categoryId?: CatalogCategoryId | string | null | undefined
  ): boolean {
    return this.store.hasFeature(featureKey, categoryId);
  }

  getSelectableCategories() {
    return this.selectableCategories();
  }
}
