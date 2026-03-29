import { CatalogCategoryId } from '../catalog-categories';
import { FitmentSearchMode } from '../fitment';
import { StorefrontMode } from '../storefront-data';
import {
  StorefrontModeContext,
  StorefrontModeInput
} from '../storefront-mode';

export type StorefrontBootstrapSource = 'route' | 'account' | 'fallback';

export type StorefrontAccountType = 'retailer' | 'supplier' | 'both';

export interface StorefrontBootstrapAccountContext {
  accountId: string | number | null;
  accountName: string | null;
  accountType: StorefrontAccountType | null;
  retailEnabled: boolean;
  wholesaleEnabled: boolean;
  subscriptionLabel: string | null;
  reportsEnabled: boolean;
  reportsCustomerLimit: number | null;
  enabledCategories: CatalogCategoryId[];
}

export interface StorefrontBootstrapRouteState {
  category: string | null;
  fitmentMode: FitmentSearchMode | null;
  storefrontMode: StorefrontModeInput;
  query: Record<string, string>;
  initialized: boolean;
}

export interface StorefrontBootstrapResolvedState {
  source: StorefrontBootstrapSource;
  mode: StorefrontMode;
  category: CatalogCategoryId;
  fitmentMode: FitmentSearchMode;
  modeContext: StorefrontModeContext;
  accountLabel: string | null;
}

export interface StorefrontBootstrapState {
  route: StorefrontBootstrapRouteState;
  account: StorefrontBootstrapAccountContext | null;
  resolved: StorefrontBootstrapResolvedState;
}
