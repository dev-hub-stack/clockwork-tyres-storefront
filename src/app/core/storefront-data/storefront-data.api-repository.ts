import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import { FitmentSearchQuery } from '../fitment';
import {
  createEmptyStorefrontDataState,
  createEmptyStorefrontProfile,
  StorefrontCartLine,
  StorefrontCartLineInput,
  StorefrontCheckoutPayload,
  StorefrontCheckoutResult,
  StorefrontCatalogItem,
  StorefrontAddress,
  StorefrontDataState,
  StorefrontDataLoadStatus,
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
import { StorefrontDataRepository } from './storefront-data.repository';
import { StorefrontCatalogApiService } from './storefront-catalog.api';
import { mapCatalogApiItem, mapCatalogApiProduct } from './storefront-catalog.api.mapper';
import { StorefrontOrderApiService } from './storefront-order.api';
import { StorefrontWorkspaceApiService } from './storefront-workspace.api';
import { BusinessSessionService } from '../auth';

const createInitialState = (): StorefrontDataState => structuredClone(createEmptyStorefrontDataState());
const CART_STORAGE_KEY_PREFIX = 'clockwork-storefront-cart';

@Injectable({
  providedIn: 'root'
})
export class ApiStorefrontDataRepository implements StorefrontDataRepository {
  private readonly stateSignal = signal<StorefrontDataState>(createInitialState());
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

    if (
      !force
      && this.lastWorkspaceKey === requestKey
      && ['ready', 'empty'].includes(this.stateSignal().workspaceStatus)
    ) {
      return;
    }

    this.setWorkspaceStatus('loading');

    try {
      const response = await this.workspaceApi.fetchWorkspace();
      const profile = response?.profile;

      if (!profile) {
        this.clearWorkspaceState('empty', 'No business workspace data is available for the selected account.');
        return;
      }

      this.lastWorkspaceKey = requestKey;

      this.stateSignal.update((state) => ({
        ...state,
        profile,
        addresses: response.addresses,
        orders: response.orders,
        workspaceStatus: 'ready',
        workspaceError: null
      }));
    } catch {
      this.clearWorkspaceState('error', 'Unable to load business workspace data right now.');
    }
  }

  restoreWorkspaceFallback(): void {
    this.clearWorkspaceState('idle');
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

    if (
      this.lastCatalogKey === requestKey
      && ['ready', 'empty'].includes(this.stateSignal().catalogStatus)
    ) {
      return;
    }

    this.setCatalogStatus('loading');

    try {
      const response = await this.catalogApi.fetchCatalog(mode, category, searchQuery);

      if (!response) {
        this.clearCatalogState('empty', 'No products matched this search yet.');
        return;
      }

      const catalogItems = response.items.map(mapCatalogApiItem);
      this.lastCatalogKey = requestKey;

      this.stateSignal.update((state) => ({
        ...state,
        catalog: catalogItems,
        catalogStatus: catalogItems.length ? 'ready' : 'empty',
        catalogError: catalogItems.length ? null : 'No products matched this search yet.'
      }));
    } catch {
      this.clearCatalogState('error', 'Unable to load live catalogue data right now.');
    }
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

    try {
      const response = await this.catalogApi.fetchProduct(slug, mode, category);

      if (!response) {
        this.removeHydratedProduct(slug);
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
    } catch (error) {
      this.removeHydratedProduct(slug);
      throw error;
    }
  }

  restoreCatalogFallback(): void {
    this.clearCatalogState('idle');
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
    const fallback = createInitialState();
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

  private setCatalogStatus(status: StorefrontDataLoadStatus, error: string | null = null): void {
    this.stateSignal.update((state) => ({
      ...state,
      catalogStatus: status,
      catalogError: error
    }));
  }

  private clearCatalogState(status: StorefrontDataLoadStatus, error: string | null = null): void {
    this.lastCatalogKey = null;
    this.hydratedProducts.clear();

    this.stateSignal.update((state) => ({
      ...state,
      catalog: [],
      pdp: {},
      catalogStatus: status,
      catalogError: error
    }));
  }

  private removeHydratedProduct(slug: string): void {
    this.stateSignal.update((state) => {
      const nextPdp = { ...state.pdp };
      delete nextPdp[slug];

      return {
        ...state,
        pdp: nextPdp
      };
    });
  }

  private setWorkspaceStatus(status: StorefrontDataLoadStatus, error: string | null = null): void {
    this.stateSignal.update((state) => ({
      ...state,
      workspaceStatus: status,
      workspaceError: error
    }));
  }

  private clearWorkspaceState(status: StorefrontDataLoadStatus, error: string | null = null): void {
    this.lastWorkspaceKey = null;

    this.stateSignal.update((state) => ({
      ...state,
      profile: createEmptyStorefrontProfile(),
      addresses: [],
      orders: [],
      workspaceStatus: status,
      workspaceError: error
    }));
  }
}
