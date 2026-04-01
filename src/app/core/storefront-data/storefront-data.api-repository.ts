import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import { FitmentSearchQuery } from '../fitment';
import {
  StorefrontCartLine,
  StorefrontCartLineInput,
  StorefrontCheckoutPayload,
  StorefrontCheckoutResult,
  StorefrontCatalogItem,
  StorefrontAddress,
  StorefrontDataState,
  StorefrontMode,
  StorefrontOrder,
  StorefrontPdpItem,
  StorefrontProfile
} from './storefront-data.models';
import {
  resolveCatalogItemBySku,
  resolveCatalogItems,
  resolveFeaturedCatalogItems,
  resolvePdpItemBySlug
} from './storefront-catalog.helpers';
import { storefrontMockState } from './storefront-data.mock';
import { StorefrontDataRepository } from './storefront-data.repository';
import { StorefrontCatalogApiService } from './storefront-catalog.api';
import { mapCatalogApiItem, mapCatalogApiProduct } from './storefront-catalog.api.mapper';
import { StorefrontOrderApiService } from './storefront-order.api';
import { StorefrontWorkspaceApiService } from './storefront-workspace.api';
import { BusinessSessionService } from '../auth';

const cloneState = (): StorefrontDataState => structuredClone(storefrontMockState);
const CART_STORAGE_KEY_PREFIX = 'clockwork-storefront-cart';

@Injectable({
  providedIn: 'root'
})
export class ApiStorefrontDataRepository implements StorefrontDataRepository {
  private readonly stateSignal = signal<StorefrontDataState>(cloneState());
  private readonly platformId = inject(PLATFORM_ID);
  private readonly businessSession = inject(BusinessSessionService);
  private readonly catalogApi = inject(StorefrontCatalogApiService);
  private readonly orderApi = inject(StorefrontOrderApiService);
  private readonly workspaceApi = inject(StorefrontWorkspaceApiService);
  private readonly browser = isPlatformBrowser(this.platformId);

  private lastCatalogKey: string | null = null;
  private lastWorkspaceKey: string | null = null;
  private readonly hydratedProducts = new Set<string>();

  readonly state = this.stateSignal.asReadonly();

  constructor() {
    this.restoreStoredCart();
  }

  getCatalogItems(mode: StorefrontMode, category: CatalogCategoryId): StorefrontCatalogItem[] {
    return resolveCatalogItems(this.stateSignal().catalog, mode, category);
  }

  getFeaturedCatalogItems(mode: StorefrontMode, category: CatalogCategoryId): StorefrontCatalogItem[] {
    return resolveFeaturedCatalogItems(this.stateSignal().catalog, mode, category);
  }

  getProductBySku(
    sku: string,
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): StorefrontCatalogItem | undefined {
    return resolveCatalogItemBySku(this.stateSignal().catalog, sku, mode, category);
  }

  getProductBySlug(
    slug: string,
    _mode: StorefrontMode,
    category: CatalogCategoryId
  ): StorefrontPdpItem | undefined {
    return resolvePdpItemBySlug(this.stateSignal().pdp, slug, category);
  }

  async hydrateWorkspace(accountKey: string | number | null, force = false): Promise<void> {
    if (!this.workspaceApi.hasAuthenticatedSession() || accountKey === null) {
      this.restoreWorkspaceFallback();
      return;
    }

    const requestKey = String(accountKey);

    if (!force && this.lastWorkspaceKey === requestKey) {
      return;
    }

    const response = await this.workspaceApi.fetchWorkspace();
    const profile = response?.profile;

    if (!profile) {
      return;
    }

    this.lastWorkspaceKey = requestKey;

    this.stateSignal.update((state) => ({
      ...state,
      profile,
      addresses: response.addresses,
      orders: response.orders
    }));
  }

  restoreWorkspaceFallback(): void {
    const fallback = cloneState();

    this.lastWorkspaceKey = null;

    this.stateSignal.update((state) => ({
      ...state,
      profile: fallback.profile,
      addresses: fallback.addresses,
      orders: fallback.orders
    }));
  }

  async hydrateCatalog(
    mode: StorefrontMode,
    category: CatalogCategoryId,
    accountKey: string | number | null,
    searchQuery: FitmentSearchQuery = {}
  ): Promise<void> {
    if (!this.catalogApi.hasAuthenticatedSession() || accountKey === null) {
      this.restoreCatalogFallback();
      return;
    }

    const requestKey = `${accountKey}:${mode}:${category}:${this.serializeSearchQuery(searchQuery)}`;

    if (this.lastCatalogKey === requestKey) {
      return;
    }

    const response = await this.catalogApi.fetchCatalog(mode, category, searchQuery);

    if (!response) {
      return;
    }

    this.lastCatalogKey = requestKey;

    this.stateSignal.update((state) => ({
      ...state,
      catalog: response.items.map(mapCatalogApiItem)
    }));
  }

  async hydrateProduct(
    slug: string,
    mode: StorefrontMode,
    category: CatalogCategoryId,
    accountKey: string | number | null
  ): Promise<void> {
    if (!this.catalogApi.hasAuthenticatedSession() || accountKey === null) {
      return;
    }

    const requestKey = `${accountKey}:${mode}:${category}:${slug}`;

    if (this.hydratedProducts.has(requestKey)) {
      return;
    }

    const response = await this.catalogApi.fetchProduct(slug, mode, category);

    if (!response) {
      return;
    }

    const product = mapCatalogApiProduct(response.product);
    this.hydratedProducts.add(requestKey);

    this.stateSignal.update((state) => ({
      ...state,
      pdp: {
        ...state.pdp,
        [product.slug]: product
      }
    }));
  }

  restoreCatalogFallback(): void {
    const fallback = cloneState();

    this.lastCatalogKey = null;
    this.hydratedProducts.clear();

    this.stateSignal.update((state) => ({
      ...state,
      catalog: fallback.catalog,
      pdp: fallback.pdp
    }));
  }

  setMode(mode: StorefrontMode): void {
    this.stateSignal.update((state) => ({
      ...state,
      mode
    }));
  }

  setCategory(category: CatalogCategoryId): void {
    this.stateSignal.update((state) => ({
      ...state,
      activeCategory: category
    }));
  }

  updateProfile(profile: StorefrontProfile): void {
    this.stateSignal.update((state) => ({
      ...state,
      profile
    }));
  }

  addAddress(address: StorefrontAddress): void {
    this.stateSignal.update((state) => ({
      ...state,
      addresses: [...state.addresses, address]
    }));
  }

  updateAddress(addressId: number, nextAddress: StorefrontAddress): void {
    this.stateSignal.update((state) => ({
      ...state,
      addresses: state.addresses.map((address) =>
        address.id === addressId ? nextAddress : address
      )
    }));
  }

  deleteAddress(addressId: number): void {
    this.stateSignal.update((state) => ({
      ...state,
      addresses: state.addresses.filter((address) => address.id !== addressId)
    }));
  }

  addCartLine(line: StorefrontCartLineInput): void {
    this.stateSignal.update((state) => {
      const existingLine = state.cart.find((cartLine) => cartLine.sku === line.sku);

      if (existingLine) {
        const nextState = {
          ...state,
          cart: state.cart.map((cartLine) =>
            cartLine.sku === line.sku
              ? { ...cartLine, quantity: cartLine.quantity + Math.max(1, line.quantity) }
              : cartLine
          )
        };

        this.persistCart(nextState.cart);

        return nextState;
      }

      const nextId = state.cart.reduce((maxId, cartLine) => Math.max(maxId, cartLine.id), 0) + 1;

      const nextState = {
        ...state,
        cart: [...state.cart, { ...line, id: nextId }]
      };

      this.persistCart(nextState.cart);

      return nextState;
    });
  }

  updateCartLineQuantity(lineId: number, quantity: number): void {
    this.stateSignal.update((state) => {
      const nextState = {
        ...state,
        cart: state.cart.map((line) =>
          line.id === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
        )
      };

      this.persistCart(nextState.cart);

      return nextState;
    });
  }

  removeCartLine(lineId: number): void {
    this.stateSignal.update((state) => {
      const nextState = {
        ...state,
        cart: state.cart.filter((line) => line.id !== lineId)
      };

      this.persistCart(nextState.cart);

      return nextState;
    });
  }

  clearCart(): void {
    this.stateSignal.update((state) => {
      const nextState = {
        ...state,
        cart: []
      };

      this.persistCart(nextState.cart);

      return nextState;
    });
  }

  async submitOrder(
    payload: StorefrontCheckoutPayload,
    accountKey: string | number | null
  ): Promise<StorefrontCheckoutResult | null> {
    const result = await this.orderApi.createOrder(payload);

    if (!result) {
      return null;
    }

    this.clearCart();
    void this.hydrateWorkspace(accountKey, true);

    return result;
  }

  reset(): void {
    this.lastCatalogKey = null;
    this.lastWorkspaceKey = null;
    this.hydratedProducts.clear();
    const fallback = cloneState();
    this.stateSignal.set({
      ...fallback,
      cart: []
    });
    this.persistCart([]);
  }

  getOrders(): StorefrontOrder[] {
    return this.stateSignal().orders;
  }

  private restoreStoredCart(): void {
    if (!this.browser) {
      return;
    }

    const storedCart = this.readStoredCart();

    if (!storedCart.length) {
      return;
    }

    this.stateSignal.update((state) => ({
      ...state,
      cart: storedCart
    }));
  }

  private persistCart(cart: StorefrontCartLine[]): void {
    if (!this.browser) {
      return;
    }

    window.localStorage.setItem(this.cartStorageKey(), JSON.stringify(cart));
  }

  private readStoredCart(): StorefrontCartLine[] {
    if (!this.browser) {
      return [];
    }

    const raw = window.localStorage.getItem(this.cartStorageKey());

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as StorefrontCartLine[];
    } catch {
      window.localStorage.removeItem(this.cartStorageKey());
      return [];
    }
  }

  private cartStorageKey(): string {
    const accountId = this.businessSession.session()?.account_context.current_account?.id ?? 'guest';
    return `${CART_STORAGE_KEY_PREFIX}:${accountId}`;
  }

  private serializeSearchQuery(searchQuery: FitmentSearchQuery): string {
    return JSON.stringify(
      Object.entries(searchQuery)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    );
  }
}
