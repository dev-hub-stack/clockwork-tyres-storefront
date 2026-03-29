import { CATALOG_CATEGORY_CONFIG } from './catalog-category.config';
import {
  CatalogCategoryBootstrapContract,
  CatalogCategoryConfig,
  CatalogCategoryFeatureKey,
  CatalogCategoryFeatureState,
  CatalogCategoryId,
  CatalogCategoryViewModel
} from './catalog-category.types';

export const buildCatalogCategoryConfigMap = (
  categories: CatalogCategoryBootstrapContract[] | null | undefined,
  fallbackConfigMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): Record<CatalogCategoryId, CatalogCategoryConfig> => {
  if (!categories?.length) {
    return fallbackConfigMap;
  }

  const contracts = new Map(categories.map((category) => [category.id, category] as const));

  return Object.entries(fallbackConfigMap).reduce((configMap, [categoryId, fallbackConfig]) => {
    const contract = contracts.get(categoryId as CatalogCategoryId);

    configMap[categoryId as CatalogCategoryId] = contract
      ? mergeCatalogCategoryConfig(fallbackConfig, contract)
      : fallbackConfig;

    return configMap;
  }, {} as Record<CatalogCategoryId, CatalogCategoryConfig>);
};

export const isCatalogCategoryId = (
  value: string,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): value is CatalogCategoryId => value in configMap;

export const resolveCatalogCategoryId = (
  value: CatalogCategoryId | string | null | undefined,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG,
  allowedCategoryIds: readonly CatalogCategoryId[] | null = null
): CatalogCategoryId => {
  if (value && isCatalogCategoryId(value, configMap) && isCategoryAllowed(value, allowedCategoryIds)) {
    return value;
  }

  if (allowedCategoryIds?.length) {
    const allowedCategory = allowedCategoryIds.find((categoryId) => isCatalogCategoryId(categoryId, configMap));

    if (allowedCategory) {
      return allowedCategory;
    }
  }

  return getLaunchCatalogCategoryId(configMap);
};

export const getCatalogCategoryConfig = (
  categoryId: CatalogCategoryId | string | null | undefined,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): CatalogCategoryConfig => configMap[resolveCatalogCategoryId(categoryId, configMap)];

export const getCatalogCategoryFeature = (
  categoryId: CatalogCategoryId | string | null | undefined,
  featureKey: CatalogCategoryFeatureKey,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): CatalogCategoryFeatureState => getCatalogCategoryConfig(categoryId, configMap).features[featureKey];

export const hasCatalogCategoryFeature = (
  categoryId: CatalogCategoryId | string | null | undefined,
  featureKey: CatalogCategoryFeatureKey,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): boolean => getCatalogCategoryFeature(categoryId, featureKey, configMap).enabled;

export const buildCatalogCategoryViewModel = (
  categoryId: CatalogCategoryId | string | null | undefined,
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG,
  allowedCategoryIds: readonly CatalogCategoryId[] | null = null
): CatalogCategoryViewModel => {
  const config = getCatalogCategoryConfig(categoryId, configMap);
  const isSelectable = config.enabled && isCategoryAllowed(config.id, allowedCategoryIds);

  return {
    ...config,
    isLaunchCategory: config.launchCategory,
    isSelectable,
    isReadOnly: !isSelectable
  };
};

export const getSelectableCatalogCategories = (
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG,
  allowedCategoryIds: readonly CatalogCategoryId[] | null = null
): CatalogCategoryViewModel[] =>
  Object.values(configMap)
    .map((config) => buildCatalogCategoryViewModel(config.id, configMap, allowedCategoryIds))
    .filter((category) => category.isSelectable);

export const getLaunchCatalogCategoryId = (
  configMap: Record<CatalogCategoryId, CatalogCategoryConfig> = CATALOG_CATEGORY_CONFIG
): CatalogCategoryId => {
  const launchCategory = Object.values(configMap).find((config) => config.launchCategory && config.enabled);

  if (launchCategory) {
    return launchCategory.id;
  }

  const firstEnabledCategory = Object.values(configMap).find((config) => config.enabled);

  if (firstEnabledCategory) {
    return firstEnabledCategory.id;
  }

  return (Object.keys(configMap)[0] as CatalogCategoryId) ?? 'tyres';
};

function mergeCatalogCategoryConfig(
  fallbackConfig: CatalogCategoryConfig,
  contract: CatalogCategoryBootstrapContract
): CatalogCategoryConfig {
  const mergedFeatures = Object.entries(fallbackConfig.features).reduce((features, [featureKey, fallbackState]) => {
    const contractState = contract.features?.[featureKey as CatalogCategoryFeatureKey];

    features[featureKey as CatalogCategoryFeatureKey] = contractState
      ? mergeCatalogCategoryFeatureState(fallbackState, contractState)
      : fallbackState;

    return features;
  }, {} as Record<CatalogCategoryFeatureKey, CatalogCategoryFeatureState>);

  return {
    ...fallbackConfig,
    id: contract.id,
    label: contract.label ?? fallbackConfig.label,
    enabled: contract.enabled,
    launchCategory: contract.launch_category ?? fallbackConfig.launchCategory,
    features: mergedFeatures,
    searchBySizeFields: contract.search_by_size_fields?.length
      ? contract.search_by_size_fields
      : fallbackConfig.searchBySizeFields,
    searchByVehicleFields: contract.search_by_vehicle_fields?.length
      ? contract.search_by_vehicle_fields
      : fallbackConfig.searchByVehicleFields,
    specFields: contract.spec_fields?.length ? contract.spec_fields : fallbackConfig.specFields
  };
}

function mergeCatalogCategoryFeatureState(
  fallbackState: CatalogCategoryFeatureState,
  contractState: NonNullable<CatalogCategoryBootstrapContract['features']>[CatalogCategoryFeatureKey]
): CatalogCategoryFeatureState {
  return {
    ...fallbackState,
    ...contractState
  };
}

function isCategoryAllowed(
  categoryId: CatalogCategoryId,
  allowedCategoryIds: readonly CatalogCategoryId[] | null
): boolean {
  if (!allowedCategoryIds?.length) {
    return true;
  }

  return allowedCategoryIds.includes(categoryId);
}
