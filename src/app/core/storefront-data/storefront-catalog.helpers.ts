import { CatalogCategoryId } from '../catalog-categories';
import { StorefrontCatalogItem, StorefrontMode, StorefrontPdpItem } from './storefront-data.models';

export function resolveCatalogItems(
  items: StorefrontCatalogItem[],
  mode: StorefrontMode,
  category: CatalogCategoryId
): StorefrontCatalogItem[] {
  return [...items]
    .filter((item) => item.category === category)
    .filter((item) => isVisibleInMode(item, mode))
    .sort((left, right) => {
      const leftRank = left.availability.origin === 'own' ? 0 : 1;
      const rightRank = right.availability.origin === 'own' ? 0 : 1;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return left.brand.localeCompare(right.brand);
    });
}

export function resolveFeaturedCatalogItems(
  items: StorefrontCatalogItem[],
  mode: StorefrontMode,
  category: CatalogCategoryId
): StorefrontCatalogItem[] {
  return resolveCatalogItems(items, mode, category).filter((item) => item.featured);
}

export function resolveCatalogItemBySku(
  items: StorefrontCatalogItem[],
  sku: string,
  mode: StorefrontMode,
  category: CatalogCategoryId
): StorefrontCatalogItem | undefined {
  return resolveCatalogItems(items, mode, category).find((item) => item.sku === sku);
}

export function resolvePdpItemBySlug(
  items: Record<string, StorefrontPdpItem>,
  slug: string,
  category: CatalogCategoryId
): StorefrontPdpItem | undefined {
  const item = items[slug];

  if (!item || item.category !== category) {
    return undefined;
  }

  return item;
}

export function isVisibleInMode(item: { modeAvailability: { retailStore: boolean; supplierPreview: boolean } }, mode: StorefrontMode): boolean {
  return mode === 'retail-store'
    ? item.modeAvailability.retailStore
    : item.modeAvailability.supplierPreview;
}
