import { CatalogCategoryId } from '../catalog-categories';
import type { CatalogCategoryBootstrapContract } from '../catalog-categories';
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

export type StorefrontBootstrapApiCategory = CatalogCategoryBootstrapContract;

export interface StorefrontBootstrapApiCategoryDefaults {
  active: string | null;
  enabled: string[];
}

export interface StorefrontBootstrapApiAccount {
  id: string | number | null;
  slug: string | null;
  name: string | null;
  account_type: StorefrontAccountType | string | null;
  retail_enabled: boolean;
  wholesale_enabled: boolean;
  base_subscription_plan: string | null;
  reports_subscription_enabled: boolean;
  reports_customer_limit: number | null;
  supported_modes?: StorefrontModeInput[];
  supports_retail_storefront?: boolean;
  supports_wholesale_portal?: boolean;
  has_reports_subscription?: boolean;
}

export interface StorefrontBootstrapApiData {
  version: number;
  storefront_mode: StorefrontModeInput;
  endpoints?: StorefrontBootstrapApiEndpoints | null;
  capabilities?: {
    cart_enabled: boolean;
    checkout_enabled: boolean;
    supplier_identity_hidden: boolean;
    manual_supplier_selection: boolean;
    search: {
      by_vehicle: boolean;
      by_size: boolean;
    };
  } | null;
  account: StorefrontBootstrapApiAccount | null;
  storefront: {
    cart_enabled: boolean;
    checkout_enabled: boolean;
    supplier_identity_hidden: boolean;
    manual_supplier_selection: boolean;
    search: {
      by_vehicle: boolean;
      by_size: boolean;
    };
  };
  categories: StorefrontBootstrapApiCategory[];
  category_defaults?: StorefrontBootstrapApiCategoryDefaults | null;
  pricing?: {
    levels: string[];
  } | null;
}

export interface StorefrontBootstrapApiEndpoints {
  bootstrap: string;
  account_context: string;
  account_context_select: string;
  catalog: string;
  product_detail: string;
  search_sizes: string;
  search_vehicles: string;
}

export interface StorefrontBootstrapApiResponse {
  status: boolean;
  message?: string | null;
  data: StorefrontBootstrapApiData | null;
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
  endpoints: StorefrontBootstrapApiEndpoints | null;
  categories: StorefrontBootstrapApiCategory[] | null;
  categoryDefaults: StorefrontBootstrapApiCategoryDefaults | null;
  resolved: StorefrontBootstrapResolvedState;
}
