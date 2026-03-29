import { CatalogCategoryId, CATALOG_CATEGORY_CONFIG } from '../catalog-categories';
import { FitmentProviderConfig, FitmentProviderId } from './fitment.types';

export const FITMENT_PROVIDER_CONFIG: Record<FitmentProviderId, FitmentProviderConfig> = {
  tyres: {
    id: 'tyres',
    categoryId: 'tyres',
    label: 'Tyre Fitment',
    description: 'Launch fitment provider for tyre search by size and vehicle.',
    enabled: true,
    launchCategory: true,
    searchSource: 'internal',
    supportsSizeSearch: true,
    supportsVehicleSearch: true,
    searchBySizeFields: CATALOG_CATEGORY_CONFIG.tyres.searchBySizeFields,
    searchByVehicleFields: CATALOG_CATEGORY_CONFIG.tyres.searchByVehicleFields,
    specFields: CATALOG_CATEGORY_CONFIG.tyres.specFields
  },
  wheels: {
    id: 'wheels',
    categoryId: 'wheels',
    label: 'Wheel Fitment',
    description: 'Future wheel fitment provider, structurally supported but disabled at launch.',
    enabled: false,
    launchCategory: false,
    searchSource: 'legacy-wheel-size',
    supportsSizeSearch: true,
    supportsVehicleSearch: true,
    searchBySizeFields: CATALOG_CATEGORY_CONFIG.wheels.searchBySizeFields,
    searchByVehicleFields: CATALOG_CATEGORY_CONFIG.wheels.searchByVehicleFields,
    specFields: CATALOG_CATEGORY_CONFIG.wheels.specFields
  }
};

export const FITMENT_PROVIDER_CONFIGS = Object.values(FITMENT_PROVIDER_CONFIG);

export const FITMENT_PROVIDER_CATEGORY_MAP: Record<CatalogCategoryId, FitmentProviderId> = {
  tyres: 'tyres',
  wheels: 'wheels'
};
