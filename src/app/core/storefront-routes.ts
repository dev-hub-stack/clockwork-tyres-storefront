import { ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { CatalogCategoryId } from './catalog-categories';
import { FitmentSearchMode } from './fitment';
import type { StorefrontModeInput } from './storefront-mode';

export const STOREFRONT_PATHS = {
  home: '',
  homeAlias: 'home',
  featureAlias: 'feature',
  catalog: 'catalog',
  tyres: 'tyres',
  wheels: 'wheels',
  searchBySize: 'search-by-size',
  searchByVehicle: 'search-by-vehicle',
  legacySearchByVehicle: 'serchvehicle',
  product: 'product',
  cart: 'cart',
  checkout: 'cart/checkout',
  cartAccount: 'cart/account',
  login: 'login',
  account: 'account',
  accountProfile: 'profile',
  accountAddresses: 'addresses',
  accountOrders: 'orders',
  myAccount: 'my-account',
  myProfile: 'my-account/my-profile',
  myAddresses: 'my-account/address-books',
  myInvoices: 'my-account/my-invoices',
  profileDashboard: 'profile-dashboard'
} as const;

export const STOREFRONT_ROUTE_DATA_KEYS = {
  category: 'category',
  fitmentMode: 'fitmentMode',
  useStorefrontHeader: 'useStorefrontHeader'
} as const;

export const STOREFRONT_ROUTE_QUERY_KEYS = {
  category: 'category',
  fitmentMode: 'fitmentMode',
  storefrontMode: 'mode',
  searchByVehicle: 'searchByVehicle',
  searchByVehicleSnake: 'search_by_vehicle',
  searchBySize: 'searchBySize',
  searchBySizeSnake: 'search_by_size'
} as const;

export const STOREFRONT_ROUTE_RESERVED_QUERY_KEYS = new Set<string>([
  STOREFRONT_ROUTE_QUERY_KEYS.category,
  STOREFRONT_ROUTE_QUERY_KEYS.fitmentMode,
  STOREFRONT_ROUTE_QUERY_KEYS.storefrontMode,
  STOREFRONT_ROUTE_QUERY_KEYS.searchByVehicle,
  STOREFRONT_ROUTE_QUERY_KEYS.searchByVehicleSnake,
  STOREFRONT_ROUTE_QUERY_KEYS.searchBySize,
  STOREFRONT_ROUTE_QUERY_KEYS.searchBySizeSnake
]);

export type StorefrontRouteContext = {
  category: string | null;
  fitmentMode: FitmentSearchMode | null;
  storefrontMode: StorefrontModeInput;
  showStorefrontHeader: boolean;
  query: Record<string, string>;
};

export function buildProductRoute(sku: string): string[] {
  return ['/', STOREFRONT_PATHS.product, sku];
}

export function buildCatalogQueryParams(
  categoryId: CatalogCategoryId,
  fitmentMode: FitmentSearchMode
): Record<string, string | boolean> {
  return {
    ...(categoryId !== 'tyres' ? { category: categoryId } : {}),
    fitmentMode
  };
}

export function getLeafRouteSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let currentSnapshot = snapshot;

  while (currentSnapshot.firstChild) {
    currentSnapshot = currentSnapshot.firstChild;
  }

  return currentSnapshot;
}

export function getBooleanRouteData(
  snapshot: ActivatedRouteSnapshot,
  key: keyof typeof STOREFRONT_ROUTE_DATA_KEYS,
  fallback: boolean
): boolean {
  const value = snapshot.data[key];
  return typeof value === 'boolean' ? value : fallback;
}

export function getStringRouteData(
  snapshot: ActivatedRouteSnapshot,
  key: Exclude<keyof typeof STOREFRONT_ROUTE_DATA_KEYS, 'useStorefrontHeader'>
): string | null {
  const value = snapshot.data[key];
  return typeof value === 'string' ? value : null;
}

export function collectRouteQueryParams(paramMap: ParamMap): Record<string, string> {
  return paramMap.keys.reduce<Record<string, string>>((params, key) => {
    const value = paramMap.get(key);

    if (value !== null) {
      params[key] = value;
    }

    return params;
  }, {});
}

export function extractFitmentQueryParams(query: Record<string, string>): Record<string, string> {
  return Object.entries(query).reduce<Record<string, string>>((fitmentQuery, [key, value]) => {
    if (!STOREFRONT_ROUTE_RESERVED_QUERY_KEYS.has(key)) {
      fitmentQuery[key] = value;
    }

    return fitmentQuery;
  }, {});
}

export function resolveFitmentModeFromRoute(
  query: Record<string, string>,
  fitmentModeFromData: string | null
): FitmentSearchMode | null {
  if (
    query[STOREFRONT_ROUTE_QUERY_KEYS.fitmentMode] === 'search-by-vehicle' ||
    fitmentModeFromData === 'search-by-vehicle'
  ) {
    return 'search-by-vehicle';
  }

  if (
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchByVehicle] === 'true' ||
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchByVehicle] === '1' ||
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchByVehicleSnake] === 'true'
  ) {
    return 'search-by-vehicle';
  }

  if (
    query[STOREFRONT_ROUTE_QUERY_KEYS.fitmentMode] === 'search-by-size' ||
    fitmentModeFromData === 'search-by-size'
  ) {
    return 'search-by-size';
  }

  if (
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchBySizeSnake] === 'true' ||
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchBySize] === 'true' ||
    query[STOREFRONT_ROUTE_QUERY_KEYS.searchBySize] === '1'
  ) {
    return 'search-by-size';
  }

  return null;
}

export function resolveStorefrontModeFromRoute(query: Record<string, string>): StorefrontModeInput {
  const requestedMode = query[STOREFRONT_ROUTE_QUERY_KEYS.storefrontMode];

  if (
    requestedMode === 'retail-store' ||
    requestedMode === 'supplier-preview' ||
    requestedMode === 'retail' ||
    requestedMode === 'supplier' ||
    requestedMode === 'preview'
  ) {
    return requestedMode;
  }

  return null;
}

export function resolveStorefrontRouteContext(
  snapshot: ActivatedRouteSnapshot
): StorefrontRouteContext {
  const leafSnapshot = getLeafRouteSnapshot(snapshot);
  const query = collectRouteQueryParams(snapshot.queryParamMap);
  const categoryFromData = getStringRouteData(leafSnapshot, STOREFRONT_ROUTE_DATA_KEYS.category);
  const fitmentModeFromData = getStringRouteData(
    leafSnapshot,
    STOREFRONT_ROUTE_DATA_KEYS.fitmentMode
  );

  return {
    category: query[STOREFRONT_ROUTE_QUERY_KEYS.category] ?? categoryFromData,
    fitmentMode: resolveFitmentModeFromRoute(query, fitmentModeFromData),
    storefrontMode: resolveStorefrontModeFromRoute(query),
    showStorefrontHeader: getBooleanRouteData(
      leafSnapshot,
      STOREFRONT_ROUTE_DATA_KEYS.useStorefrontHeader,
      true
    ),
    query
  };
}
