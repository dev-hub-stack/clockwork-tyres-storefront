import { Injectable, computed, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories/catalog-category.types';
import {
  buildFitmentProviderViewModel,
  getEnabledFitmentProviders,
  getFitmentProviderConfig,
  getFitmentSearchFields,
  hasFitmentMode,
  resolveFitmentProviderId
} from './fitment.helpers';
import {
  FitmentProviderConfig,
  FitmentProviderId,
  FitmentProviderInput,
  FitmentProviderViewModel,
  FitmentSearchFieldDefinition,
  FitmentSearchMode
} from './fitment.types';

@Injectable({
  providedIn: 'root'
})
export class FitmentStore {
  private readonly providerIdState = signal<FitmentProviderId>('tyres');

  readonly providerId = this.providerIdState.asReadonly();

  readonly provider = computed(() => getFitmentProviderConfig(this.providerIdState()));
  readonly viewModel = computed(() => buildFitmentProviderViewModel(this.provider()));
  readonly enabledProviders = computed(() =>
    getEnabledFitmentProviders().map((provider) => buildFitmentProviderViewModel(provider))
  );
  readonly isTyresLaunchCategory = computed(() => this.provider().launchCategory);
  readonly isWheelsEnabled = computed(() => this.getProvider('wheels').enabled);

  setProvider(input: FitmentProviderInput): void {
    this.providerIdState.set(resolveFitmentProviderId(input));
  }

  setCategory(categoryId: CatalogCategoryId): void {
    this.setProvider(categoryId);
  }

  reset(): void {
    this.providerIdState.set('tyres');
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
