import { CatalogCategoryId, CatalogCategorySearchField } from '../catalog-categories/catalog-category.types';

export const FITMENT_PROVIDER_IDS = ['tyres', 'wheels'] as const;

export type FitmentProviderId = (typeof FITMENT_PROVIDER_IDS)[number];

export type FitmentProviderInput = CatalogCategoryId | FitmentProviderId | null | undefined;

export const FITMENT_SEARCH_MODES = ['search-by-size', 'search-by-vehicle'] as const;

export type FitmentSearchMode = (typeof FITMENT_SEARCH_MODES)[number];

export type FitmentSearchFieldDefinition = CatalogCategorySearchField;

export type FitmentQueryValue = string | number | boolean | null | undefined;

export type FitmentSearchQuery = Record<string, FitmentQueryValue>;

export type FitmentVehicleSearchInput = {
  year?: FitmentQueryValue;
  make?: FitmentQueryValue;
  model?: FitmentQueryValue;
  modification?: FitmentQueryValue;
  subModel?: FitmentQueryValue;
} & FitmentSearchQuery;

export type FitmentSearchSource = 'manual' | 'legacy-wheel-size' | 'internal';

export type FitmentProviderConfig = {
  id: FitmentProviderId;
  categoryId: CatalogCategoryId;
  label: string;
  description: string;
  enabled: boolean;
  launchCategory: boolean;
  searchSource: FitmentSearchSource;
  supportsSizeSearch: boolean;
  supportsVehicleSearch: boolean;
  searchBySizeFields: FitmentSearchFieldDefinition[];
  searchByVehicleFields: FitmentSearchFieldDefinition[];
  specFields: string[];
};

export type FitmentProviderViewModel = FitmentProviderConfig & {
  isLaunchProvider: boolean;
  isSelectable: boolean;
  isReadOnly: boolean;
};
