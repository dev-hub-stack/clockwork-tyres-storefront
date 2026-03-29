import { CatalogCategoryId } from '../catalog-categories/catalog-category.types';
import {
  FITMENT_PROVIDER_CATEGORY_MAP,
  FITMENT_PROVIDER_CONFIGS
} from './fitment.config';
import {
  FitmentProviderConfig,
  FitmentProviderId,
  FitmentProviderInput,
  FitmentProviderViewModel,
  FitmentSearchFieldDefinition,
  FitmentSearchQuery,
  FitmentSearchMode
} from './fitment.types';

export function resolveFitmentProviderId(input: FitmentProviderInput): FitmentProviderId {
  if (input === 'wheels' || input === 'tyres') {
    return input;
  }

  return 'tyres';
}

export function getFitmentProviderConfig(input: FitmentProviderInput = 'tyres'): FitmentProviderConfig {
  const providerId = resolveFitmentProviderId(input);

  return (
    FITMENT_PROVIDER_CONFIGS.find((provider) => provider.id === providerId) ??
    FITMENT_PROVIDER_CONFIGS[0]
  );
}

export function getFitmentProviderForCategory(categoryId: CatalogCategoryId): FitmentProviderConfig {
  return getFitmentProviderConfig(FITMENT_PROVIDER_CATEGORY_MAP[categoryId]);
}

export function buildFitmentProviderViewModel(
  provider: FitmentProviderConfig
): FitmentProviderViewModel {
  return {
    ...provider,
    isLaunchProvider: provider.launchCategory,
    isSelectable: provider.enabled || provider.launchCategory,
    isReadOnly: !provider.enabled
  };
}

export function getFitmentSearchFields(
  provider: FitmentProviderConfig,
  mode: FitmentSearchMode
): FitmentSearchFieldDefinition[] {
  return mode === 'search-by-vehicle'
    ? provider.searchByVehicleFields
    : provider.searchBySizeFields;
}

export function hasFitmentMode(provider: FitmentProviderConfig, mode: FitmentSearchMode): boolean {
  return mode === 'search-by-vehicle'
    ? provider.supportsVehicleSearch
    : provider.supportsSizeSearch;
}

export function getEnabledFitmentProviders(): FitmentProviderConfig[] {
  return FITMENT_PROVIDER_CONFIGS.filter((provider) => provider.enabled || provider.launchCategory);
}

export function resolveFitmentSearchMode(
  mode: FitmentSearchMode | string | null | undefined
): FitmentSearchMode {
  return mode === 'search-by-vehicle' ? 'search-by-vehicle' : 'search-by-size';
}

export function normalizeFitmentSearchQuery(query: FitmentSearchQuery): FitmentSearchQuery {
  return Object.entries(query).reduce<FitmentSearchQuery>((normalized, [key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) {
      return normalized;
    }

    normalized[key] = value;
    return normalized;
  }, {});
}

export function buildFitmentSearchSummary(
  provider: FitmentProviderConfig,
  mode: FitmentSearchMode,
  query: FitmentSearchQuery
): string[] {
  const normalizedQuery = normalizeFitmentSearchQuery(query);

  return getFitmentSearchFields(provider, mode).flatMap((field) => {
    const value = normalizedQuery[field.key];

    if (value === undefined || value === null || value === '' || value === false) {
      return [];
    }

    return [`${field.label}: ${value === true ? 'Yes' : value}`];
  });
}
