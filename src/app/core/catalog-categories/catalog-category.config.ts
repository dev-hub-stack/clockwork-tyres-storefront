import {
  CatalogCategoryConfig,
  CatalogCategoryFeatureKey,
  CatalogCategoryFeatureState,
  CatalogCategoryId,
  CatalogCategorySearchField
} from './catalog-category.types';

const createFeatureState = (
  key: CatalogCategoryFeatureKey,
  mode: CatalogCategoryFeatureState['mode'],
  enabled: boolean
): CatalogCategoryFeatureState => ({
  key,
  mode,
  enabled
});

const tyreSizeFields: CatalogCategorySearchField[] = [
  { key: 'width', label: 'Width', type: 'number', required: true },
  { key: 'aspectRatio', label: 'Aspect Ratio', type: 'number', required: true },
  { key: 'rimSize', label: 'Rim Size', type: 'number', required: true },
  { key: 'loadIndex', label: 'Load Index', type: 'text' },
  { key: 'speedRating', label: 'Speed Rating', type: 'text' },
  { key: 'season', label: 'Season', type: 'select' }
];

const tyreVehicleFields: CatalogCategorySearchField[] = [
  { key: 'make', label: 'Make', type: 'select', required: true },
  { key: 'model', label: 'Model', type: 'select', required: true },
  { key: 'year', label: 'Year', type: 'select', required: true },
  { key: 'variant', label: 'Variant', type: 'select' }
];

const wheelSizeFields: CatalogCategorySearchField[] = [
  { key: 'rimDiameter', label: 'Rim Diameter', type: 'number', required: true },
  { key: 'rimWidth', label: 'Rim Width', type: 'number', required: true },
  { key: 'boltPattern', label: 'Bolt Pattern', type: 'text', required: true },
  { key: 'offset', label: 'Offset', type: 'text' },
  { key: 'hubBore', label: 'Hub Bore', type: 'text' }
];

const wheelVehicleFields: CatalogCategorySearchField[] = [
  { key: 'make', label: 'Make', type: 'select', required: true },
  { key: 'model', label: 'Model', type: 'select', required: true },
  { key: 'year', label: 'Year', type: 'select', required: true },
  { key: 'fitment', label: 'Fitment', type: 'toggle' }
];

const categoryFeatureDefaults = (
  features: Record<CatalogCategoryFeatureKey, CatalogCategoryFeatureState>
): Record<CatalogCategoryFeatureKey, CatalogCategoryFeatureState> => features;

const categoryConfigs: Record<CatalogCategoryId, CatalogCategoryConfig> = {
  tyres: {
    id: 'tyres',
    label: 'Tyres',
    description: 'Launch category for the new Clockwork Tyres storefront.',
    enabled: true,
    launchCategory: true,
    features: categoryFeatureDefaults({
      catalog: createFeatureState('catalog', 'enabled', true),
      'product-detail': createFeatureState('product-detail', 'enabled', true),
      'search-by-size': createFeatureState('search-by-size', 'enabled', true),
      'search-by-vehicle': createFeatureState('search-by-vehicle', 'enabled', true),
      filters: createFeatureState('filters', 'enabled', true),
      cart: createFeatureState('cart', 'enabled', true),
      checkout: createFeatureState('checkout', 'enabled', true),
      import: createFeatureState('import', 'enabled', true)
    }),
    searchBySizeFields: tyreSizeFields,
    searchByVehicleFields: tyreVehicleFields,
    specFields: ['size', 'width', 'aspectRatio', 'rimSize', 'loadIndex', 'speedRating', 'season']
  },
  wheels: {
    id: 'wheels',
    label: 'Wheels',
    description: 'Disabled at launch, but supported structurally for future reactivation.',
    enabled: false,
    launchCategory: false,
    features: categoryFeatureDefaults({
      catalog: createFeatureState('catalog', 'disabled', false),
      'product-detail': createFeatureState('product-detail', 'disabled', false),
      'search-by-size': createFeatureState('search-by-size', 'disabled', false),
      'search-by-vehicle': createFeatureState('search-by-vehicle', 'disabled', false),
      filters: createFeatureState('filters', 'disabled', false),
      cart: createFeatureState('cart', 'disabled', false),
      checkout: createFeatureState('checkout', 'disabled', false),
      import: createFeatureState('import', 'disabled', false)
    }),
    searchBySizeFields: wheelSizeFields,
    searchByVehicleFields: wheelVehicleFields,
    specFields: ['rimDiameter', 'rimWidth', 'boltPattern', 'hubBore', 'offset']
  }
};

export const CATALOG_CATEGORY_CONFIG = categoryConfigs;

