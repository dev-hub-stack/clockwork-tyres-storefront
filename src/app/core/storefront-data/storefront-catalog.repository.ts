import { CatalogCategoryId } from '../catalog-categories';
import { StorefrontCatalogItem, StorefrontMode, StorefrontPdpItem } from './storefront-data.models';

export interface StorefrontCatalogRepository {
  getCatalogItems(mode: StorefrontMode, category: CatalogCategoryId): StorefrontCatalogItem[];
  getFeaturedCatalogItems(mode: StorefrontMode, category: CatalogCategoryId): StorefrontCatalogItem[];
  getProductBySku(
    sku: string,
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): StorefrontCatalogItem | undefined;
  getProductBySlug(
    slug: string,
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): StorefrontPdpItem | undefined;
}
