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
