import { ActivatedRouteSnapshot } from '@angular/router';
import { CatalogCategoryId, resolveCatalogCategoryId } from '../catalog-categories';
import { FitmentSearchMode, resolveFitmentSearchMode } from '../fitment';
import { StorefrontMode } from '../storefront-data';
import {
  StorefrontModeContext,
  StorefrontModeInput,
  resolveStorefrontModeId
} from '../storefront-mode';
import { resolveStorefrontRouteContext } from '../storefront-routes';
import {
  StorefrontBootstrapApiEndpoints,
  StorefrontBootstrapApiAccount,
  StorefrontBootstrapApiCategory,
  StorefrontBootstrapApiCategoryDefaults,
  StorefrontBootstrapAccountContext,
  StorefrontBootstrapResolvedState,
  StorefrontBootstrapRouteState,
  StorefrontBootstrapSource,
  StorefrontBootstrapState
} from './storefront-bootstrap.types';

const DEFAULT_ROUTE_STATE: StorefrontBootstrapRouteState = {
  category: null,
  fitmentMode: null,
  storefrontMode: null,
  query: {},
  initialized: false
};

export function createStorefrontBootstrapState(): StorefrontBootstrapState {
  return {
    route: DEFAULT_ROUTE_STATE,
    account: null,
    endpoints: null,
    categories: null,
    categoryDefaults: null,
    resolved: resolveStorefrontBootstrapState(DEFAULT_ROUTE_STATE, null)
  };
}

export function normalizeStorefrontBootstrapAccountContext(
  context: StorefrontBootstrapAccountContext | null
): StorefrontBootstrapAccountContext | null {
  if (!context) {
    return null;
  }

  return {
    ...context,
    enabledCategories: Array.from(new Set(context.enabledCategories))
  };
}

export function normalizeStorefrontBootstrapApiCategories(
  categories: StorefrontBootstrapApiCategory[] | null | undefined
): StorefrontBootstrapApiCategory[] | null {
  if (!categories?.length) {
    return null;
  }

  return categories.map((category) => ({
    ...category,
    enabled: Boolean(category.enabled),
    launch_category: Boolean(category.launch_category),
    launch_status: category.launch_status ?? null,
    features: normalizeCategoryFeatures(category.features),
    search_by_size_fields: category.search_by_size_fields ?? [],
    search_by_vehicle_fields: category.search_by_vehicle_fields ?? [],
    spec_fields: category.spec_fields ?? []
  }));
}

export function normalizeStorefrontBootstrapApiCategoryDefaults(
  categoryDefaults: StorefrontBootstrapApiCategoryDefaults | null | undefined
): StorefrontBootstrapApiCategoryDefaults | null {
  if (!categoryDefaults) {
    return null;
  }

  return {
    active: categoryDefaults.active,
    enabled: Array.from(new Set(categoryDefaults.enabled ?? []))
  };
}

export function mapStorefrontBootstrapApiAccountContext(
  account: StorefrontBootstrapApiAccount | null | undefined,
  categories: StorefrontBootstrapApiCategory[] = [],
  categoryDefaults: StorefrontBootstrapApiCategoryDefaults | null = null
): StorefrontBootstrapAccountContext | null {
  if (!account) {
    return null;
  }

  const supportedModes = normalizeSupportedModes(account.supported_modes);
  const enabledCategories = resolveEnabledCategories(categories, categoryDefaults);

  return normalizeStorefrontBootstrapAccountContext({
    accountId: account.id,
    accountName: account.name,
    accountType: resolveStorefrontAccountType(account.account_type),
    retailEnabled: supportedModes ? supportedModes.includes('retail-store') : account.retail_enabled,
    wholesaleEnabled: supportedModes ? supportedModes.includes('supplier-preview') : account.wholesale_enabled,
    subscriptionLabel: formatSubscriptionLabel(account.base_subscription_plan),
    reportsEnabled: account.reports_subscription_enabled,
    reportsCustomerLimit: account.reports_customer_limit,
    enabledCategories
  });
}

export function normalizeStorefrontBootstrapApiEndpoints(
  endpoints: StorefrontBootstrapApiEndpoints | null | undefined
): StorefrontBootstrapApiEndpoints | null {
  if (!endpoints) {
    return null;
  }

  return {
    bootstrap: endpoints.bootstrap,
    account_context: endpoints.account_context,
    account_context_select: endpoints.account_context_select,
    catalog: endpoints.catalog,
    product_detail: endpoints.product_detail,
    search_sizes: endpoints.search_sizes,
    search_vehicles: endpoints.search_vehicles
  };
}

export function resolveStorefrontBootstrapMode(
  routeMode: StorefrontModeInput,
  account: StorefrontBootstrapAccountContext | null
): StorefrontMode {
  const requestedMode = routeMode ? resolveStorefrontModeId(routeMode) : null;

  if (requestedMode === 'supplier-preview' && account?.wholesaleEnabled === false) {
    return account?.retailEnabled === false ? 'retail-store' : 'retail-store';
  }

  if (requestedMode === 'retail-store' && account?.retailEnabled === false) {
    return account?.wholesaleEnabled ? 'supplier-preview' : 'retail-store';
  }

  if (requestedMode) {
    return requestedMode;
  }

  if (account?.retailEnabled) {
    return 'retail-store';
  }

  if (account?.wholesaleEnabled) {
    return 'supplier-preview';
  }

  return 'retail-store';
}

export function resolveStorefrontBootstrapCategory(
  routeCategory: string | null,
  account: StorefrontBootstrapAccountContext | null
): CatalogCategoryId {
  const requestedCategory = resolveCatalogCategoryId(routeCategory);

  if (!account || account.enabledCategories.length === 0) {
    return requestedCategory;
  }

  return account.enabledCategories.includes(requestedCategory)
    ? requestedCategory
    : account.enabledCategories[0];
}

export function resolveStorefrontBootstrapFitmentMode(
  routeFitmentMode: FitmentSearchMode | null
): FitmentSearchMode {
  return resolveFitmentSearchMode(routeFitmentMode);
}

function resolveStorefrontAccountType(value: string | null | undefined): 'retailer' | 'supplier' | 'both' | null {
  if (value === 'retailer' || value === 'supplier' || value === 'both') {
    return value;
  }

  return null;
}

function formatSubscriptionLabel(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function normalizeSupportedModes(
  supportedModes: StorefrontModeInput[] | null | undefined
): StorefrontMode[] | null {
  if (!supportedModes?.length) {
    return null;
  }

  const normalizedModes = supportedModes
    .map((mode) => resolveStorefrontModeId(mode))
    .filter((mode): mode is StorefrontMode => mode !== null);

  return normalizedModes.length ? Array.from(new Set(normalizedModes)) : null;
}

function normalizeCategoryFeatures(
  features: StorefrontBootstrapApiCategory['features'] | null | undefined
): StorefrontBootstrapApiCategory['features'] | undefined {
  if (!features) {
    return undefined;
  }

  return Object.entries(features).reduce((normalized, [featureKey, featureState]) => {
    if (!featureState) {
      return normalized;
    }

    normalized[featureKey as keyof NonNullable<StorefrontBootstrapApiCategory['features']>] = {
      key: featureState.key,
      mode: featureState.mode,
      enabled: Boolean(featureState.enabled)
    };

    return normalized;
  }, {} as NonNullable<StorefrontBootstrapApiCategory['features']>);
}

function resolveEnabledCategories(
  categories: StorefrontBootstrapApiCategory[],
  categoryDefaults: StorefrontBootstrapApiCategoryDefaults | null
): CatalogCategoryId[] {
  const configuredEnabledCategories = categoryDefaults?.enabled
    ?.map((categoryId) => resolveCatalogCategoryId(categoryId)) ?? [];

  if (configuredEnabledCategories.length) {
    return Array.from(new Set(configuredEnabledCategories));
  }

  return categories
    .filter((category) => category.enabled)
    .map((category) => resolveCatalogCategoryId(category.id));
}

export function buildStorefrontModeContext(
  account: StorefrontBootstrapAccountContext | null
): StorefrontModeContext {
  if (!account) {
    return {};
  }

  return {
    accountId: account.accountId,
    accountName: account.accountName,
    supplierId: account.wholesaleEnabled ? account.accountId : null,
    supplierName: account.wholesaleEnabled ? account.accountName : null
  };
}

export function resolveStorefrontBootstrapSource(
  routeState: StorefrontBootstrapRouteState,
  account: StorefrontBootstrapAccountContext | null
): StorefrontBootstrapSource {
  if (routeState.initialized && (routeState.storefrontMode || routeState.category || routeState.fitmentMode)) {
    return 'route';
  }

  if (account) {
    return 'account';
  }

  return 'fallback';
}

export function resolveStorefrontBootstrapState(
  routeState: StorefrontBootstrapRouteState,
  account: StorefrontBootstrapAccountContext | null
): StorefrontBootstrapResolvedState {
  const mode = resolveStorefrontBootstrapMode(routeState.storefrontMode, account);
  const category = resolveStorefrontBootstrapCategory(routeState.category, account);
  const fitmentMode = resolveStorefrontBootstrapFitmentMode(routeState.fitmentMode);

  return {
    source: resolveStorefrontBootstrapSource(routeState, account),
    mode,
    category,
    fitmentMode,
    modeContext: buildStorefrontModeContext(account),
    accountLabel: account?.accountName ?? null
  };
}

export function resolveStorefrontBootstrapRouteState(
  snapshot: ActivatedRouteSnapshot
): StorefrontBootstrapRouteState {
  const routeContext = resolveStorefrontRouteContext(snapshot);

  return {
    category: routeContext.category,
    fitmentMode: routeContext.fitmentMode,
    storefrontMode: routeContext.storefrontMode,
    query: routeContext.query,
    initialized: true
  };
}
