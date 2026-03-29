import {
  CATALOG_CATEGORY_CONFIG
} from './catalog-category.config';
import {
  CatalogCategoryConfig,
  CatalogCategoryFeatureKey,
  CatalogCategoryFeatureState,
  CatalogCategoryId,
  CatalogCategoryViewModel
} from './catalog-category.types';

export const isCatalogCategoryId = (value: string): value is CatalogCategoryId =>
  value in CATALOG_CATEGORY_CONFIG;

export const resolveCatalogCategoryId = (
  value: CatalogCategoryId | string | null | undefined
): CatalogCategoryId => {
  if (value && isCatalogCategoryId(value)) {
    return value;
  }

  return 'tyres';
};

export const getCatalogCategoryConfig = (
  categoryId: CatalogCategoryId | string | null | undefined
): CatalogCategoryConfig => CATALOG_CATEGORY_CONFIG[resolveCatalogCategoryId(categoryId)];

export const getCatalogCategoryFeature = (
  categoryId: CatalogCategoryId | string | null | undefined,
  featureKey: CatalogCategoryFeatureKey
): CatalogCategoryFeatureState => getCatalogCategoryConfig(categoryId).features[featureKey];

export const hasCatalogCategoryFeature = (
  categoryId: CatalogCategoryId | string | null | undefined,
  featureKey: CatalogCategoryFeatureKey
): boolean => getCatalogCategoryFeature(categoryId, featureKey).enabled;

export const buildCatalogCategoryViewModel = (
  categoryId: CatalogCategoryId | string | null | undefined
): CatalogCategoryViewModel => {
  const config = getCatalogCategoryConfig(categoryId);

  return {
    ...config,
    isLaunchCategory: config.launchCategory,
    isSelectable: config.enabled,
    isReadOnly: !config.enabled
  };
};

export const getSelectableCatalogCategories = (): CatalogCategoryViewModel[] =>
  Object.values(CATALOG_CATEGORY_CONFIG)
    .map((config) => buildCatalogCategoryViewModel(config.id))
    .filter((category) => category.isSelectable);

