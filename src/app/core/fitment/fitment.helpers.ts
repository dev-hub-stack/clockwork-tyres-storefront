import { CatalogCategoryId } from '../catalog-categories/catalog-category.types';
import {
  FITMENT_PROVIDER_CONFIGS
} from './fitment.config';
import {
  FitmentProviderConfig,
  FitmentProviderId,
  FitmentProviderInput,
  FitmentProviderViewModel,
  FitmentSearchFieldDefinition,
  FitmentSearchMode
} from './fitment.types';

export function resolveFitmentProviderId(input: FitmentProviderInput): FitmentProviderId {
  return input === 'wheels' ? 'wheels' : 'tyres';
}

export function getFitmentProviderConfig(input: FitmentProviderInput = 'tyres'): FitmentProviderConfig {
  const providerId = resolveFitmentProviderId(input);

  return (
    FITMENT_PROVIDER_CONFIGS.find((provider) => provider.id === providerId) ??
    FITMENT_PROVIDER_CONFIGS[0]
  );
}

export function getFitmentProviderForCategory(categoryId: CatalogCategoryId): FitmentProviderConfig {
  return getFitmentProviderConfig(categoryId);
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
