import { inject, Injectable } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import { FitmentStore } from './fitment.store';
import {
  FitmentProviderInput,
  FitmentSearchMode,
  FitmentSearchQuery
} from './fitment.types';

@Injectable({
  providedIn: 'root'
})
export class FitmentService {
  private readonly store = inject(FitmentStore);

  readonly providerId = this.store.providerId;
  readonly provider = this.store.provider;
  readonly viewModel = this.store.viewModel;
  readonly enabledProviders = this.store.enabledProviders;
  readonly searchMode = this.store.searchMode;
  readonly searchQuery = this.store.searchQuery;
  readonly searchFields = this.store.searchFields;
  readonly searchSummary = this.store.searchSummary;

  setProvider(provider: FitmentProviderInput): void {
    this.store.setProvider(provider);
  }

  setCategory(categoryId: CatalogCategoryId | string | null | undefined): void {
    if (categoryId) {
      this.store.setProvider(categoryId === 'wheels' ? 'wheels' : 'tyres');
    }
  }

  setSearchMode(mode: FitmentSearchMode | string | null | undefined): void {
    this.store.setSearchMode(mode);
  }

  setSearchQuery(query: FitmentSearchQuery): void {
    this.store.setSearchQuery(query);
  }

  setContext(context: {
    category?: CatalogCategoryId | string | null | undefined;
    provider?: FitmentProviderInput;
    mode?: FitmentSearchMode | string | null | undefined;
    query?: FitmentSearchQuery;
  }): void {
    this.store.setContext(context);
  }

  reset(): void {
    this.store.reset();
  }

  getProvider(input: FitmentProviderInput = this.providerId()): ReturnType<FitmentStore['getProvider']> {
    return this.store.getProvider(input);
  }

  getSearchFields(
    mode: FitmentSearchMode,
    input: FitmentProviderInput = this.providerId()
  ) {
    return this.store.getSearchFields(mode, input);
  }
}
