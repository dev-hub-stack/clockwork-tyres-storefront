import { Injectable, computed, signal } from '@angular/core';
import { CatalogCategoryId, resolveCatalogCategoryId } from '../catalog-categories';
import {
  buildFitmentSearchSummary,
  buildFitmentProviderViewModel,
  getEnabledFitmentProviders,
  getFitmentProviderConfig,
  getFitmentSearchFields,
  hasFitmentMode,
  normalizeFitmentSearchQuery,
  resolveFitmentSearchMode,
  resolveFitmentProviderId
} from './fitment.helpers';
import {
  FitmentProviderConfig,
  FitmentProviderId,
  FitmentProviderInput,
  FitmentProviderViewModel,
  FitmentSearchFieldDefinition,
  FitmentSearchQuery,
  FitmentSearchMode
} from './fitment.types';

@Injectable({
  providedIn: 'root'
})
export class FitmentStore {
  private readonly providerIdState = signal<FitmentProviderId>('tyres');
  private readonly searchModeState = signal<FitmentSearchMode>('search-by-size');
  private readonly searchQueryState = signal<FitmentSearchQuery>({});

  readonly providerId = this.providerIdState.asReadonly();
  readonly searchMode = this.searchModeState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();

  readonly provider = computed(() => getFitmentProviderConfig(this.providerIdState()));
  readonly viewModel = computed(() => buildFitmentProviderViewModel(this.provider()));
  readonly enabledProviders = computed(() =>
    getEnabledFitmentProviders().map((provider) => buildFitmentProviderViewModel(provider))
  );
  readonly searchFields = computed(() =>
    this.getSearchFields(this.searchModeState(), this.providerIdState())
  );
  readonly searchSummary = computed(() =>
    buildFitmentSearchSummary(this.provider(), this.searchModeState(), this.searchQueryState())
  );
  readonly isTyresLaunchCategory = computed(() => this.provider().launchCategory);
  readonly isWheelsEnabled = computed(() => this.getProvider('wheels').enabled);

  setProvider(input: FitmentProviderInput): void {
    this.providerIdState.set(resolveFitmentProviderId(input));
  }

  setCategory(categoryId: CatalogCategoryId): void {
    this.setProvider(categoryId);
  }

  setSearchMode(mode: FitmentSearchMode | string | null | undefined): void {
    this.searchModeState.set(resolveFitmentSearchMode(mode));
  }

  setSearchQuery(query: FitmentSearchQuery): void {
    this.searchQueryState.set(normalizeFitmentSearchQuery(query));
  }

  setContext(context: {
    category?: CatalogCategoryId | string | null | undefined;
    provider?: FitmentProviderInput;
    mode?: FitmentSearchMode | string | null | undefined;
    query?: FitmentSearchQuery;
  }): void {
    if (context.provider !== undefined) {
      this.setProvider(context.provider);
    } else if (context.category !== undefined) {
      this.setProvider(resolveCatalogCategoryId(context.category));
    }

    if (context.mode !== undefined) {
      this.setSearchMode(context.mode);
    }

    if (context.query !== undefined) {
      this.setSearchQuery(context.query);
    }
  }

  reset(): void {
    this.providerIdState.set('tyres');
    this.searchModeState.set('search-by-size');
    this.searchQueryState.set({});
  }

  getProvider(input: FitmentProviderInput = this.providerIdState()): FitmentProviderConfig {
    return getFitmentProviderConfig(input);
  }

  getViewModel(input: FitmentProviderInput = this.providerIdState()): FitmentProviderViewModel {
    return buildFitmentProviderViewModel(this.getProvider(input));
  }

  getSearchFields(mode: FitmentSearchMode, input: FitmentProviderInput = this.providerIdState()): FitmentSearchFieldDefinition[] {
    return getFitmentSearchFields(this.getProvider(input), mode);
  }

  hasMode(mode: FitmentSearchMode, input: FitmentProviderInput = this.providerIdState()): boolean {
    return hasFitmentMode(this.getProvider(input), mode);
  }

  isSelectable(input: FitmentProviderInput = this.providerIdState()): boolean {
    const provider = this.getProvider(input);
    return provider.enabled || provider.launchCategory;
  }
}
