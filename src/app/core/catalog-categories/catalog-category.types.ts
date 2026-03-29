export const CATALOG_CATEGORY_IDS = ['tyres', 'wheels'] as const;

export type CatalogCategoryId = (typeof CATALOG_CATEGORY_IDS)[number];

export const CATALOG_CATEGORY_FEATURE_KEYS = [
  'catalog',
  'product-detail',
  'search-by-size',
  'search-by-vehicle',
  'filters',
  'cart',
  'checkout',
  'import'
] as const;

export type CatalogCategoryFeatureKey = (typeof CATALOG_CATEGORY_FEATURE_KEYS)[number];

export type CatalogCategoryMode = 'enabled' | 'disabled' | 'hidden';

export type CatalogCategoryFeatureState = {
  key: CatalogCategoryFeatureKey;
  mode: CatalogCategoryMode;
  enabled: boolean;
};

export type CatalogCategorySearchField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  required?: boolean;
  placeholder?: string;
};

export type CatalogCategoryConfig = {
  id: CatalogCategoryId;
  label: string;
  description: string;
  enabled: boolean;
  launchCategory: boolean;
  features: Record<CatalogCategoryFeatureKey, CatalogCategoryFeatureState>;
  searchBySizeFields: CatalogCategorySearchField[];
  searchByVehicleFields: CatalogCategorySearchField[];
  specFields: string[];
};

export type CatalogCategoryViewModel = CatalogCategoryConfig & {
  isLaunchCategory: boolean;
  isSelectable: boolean;
  isReadOnly: boolean;
};

