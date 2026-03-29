import { computed, Injectable, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
  StorefrontCartLine,
  StorefrontCartViewLine,
  StorefrontCatalogItem,
  StorefrontCatalogViewItem,
  StorefrontDataState,
  StorefrontAddress,
  StorefrontMode,
  StorefrontOrder,
  StorefrontPdpItem,
  StorefrontPdpViewItem,
  StorefrontProfile
} from './storefront-data.models';
import { storefrontMockState } from './storefront-data.mock';

@Injectable({
  providedIn: 'root'
})
export class StorefrontDataStore {
  private readonly state = signal<StorefrontDataState>(storefrontMockState);

  readonly mode = computed(() => this.state().mode);
  readonly activeCategory = computed(() => this.state().activeCategory);
  readonly profile = computed(() => this.state().profile);
  readonly addresses = computed(() => this.state().addresses);
  readonly orders = computed(() => this.state().orders);
  readonly catalog = computed(() =>
    this.buildCatalogView(this.state().catalog, this.mode(), this.activeCategory())
  );
  readonly cart = computed(() => this.buildCartView(this.state().cart, this.mode()));

  setMode(mode: StorefrontMode): void {
    this.state.update((state) => ({
      ...state,
      mode
    }));
  }

  setCategory(category: CatalogCategoryId): void {
    this.state.update((state) => ({
      ...state,
      activeCategory: category
    }));
  }

  getCatalogItems(
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontCatalogViewItem[] {
    return this.buildCatalogView(this.state().catalog, mode, category);
  }

  getFeaturedCatalogItems(
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontCatalogViewItem[] {
    return this.getCatalogItems(mode, category).filter((item) => item.featured);
  }

  getProductBySku(
    sku: string,
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontCatalogViewItem | undefined {
    return this.getCatalogItems(mode, category).find((item) => item.sku === sku);
  }

  getProductBySlug(
    slug: string,
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontPdpViewItem | undefined {
    const item = this.state().pdp[slug];

    if (!item || item.category !== category) {
      return undefined;
    }

    return this.buildPdpView(item, mode);
  }

  getCartItems(mode: StorefrontMode = this.mode()): StorefrontCartViewLine[] {
    return this.buildCartView(this.state().cart, mode);
  }

  getProfile(): StorefrontProfile {
    return this.state().profile;
  }

  updateProfile(profile: StorefrontProfile): void {
    this.state.update((state) => ({
      ...state,
      profile
    }));
  }

  getAddresses(): StorefrontAddress[] {
    return this.state().addresses;
  }

  addAddress(address: StorefrontAddress): void {
    this.state.update((state) => ({
      ...state,
      addresses: [...state.addresses, address]
    }));
  }

  updateAddress(addressId: number, nextAddress: StorefrontAddress): void {
    this.state.update((state) => ({
      ...state,
      addresses: state.addresses.map((address) =>
        address.id === addressId ? nextAddress : address
      )
    }));
  }

  deleteAddress(addressId: number): void {
    this.state.update((state) => ({
      ...state,
      addresses: state.addresses.filter((address) => address.id !== addressId)
    }));
  }

  getOrders(): StorefrontOrder[] {
    return this.state().orders;
  }

  updateCartLineQuantity(lineId: number, quantity: number): void {
    this.state.update((state) => ({
      ...state,
      cart: state.cart.map((line) =>
        line.id === lineId
          ? { ...line, quantity: Math.max(1, quantity) }
          : line
      )
    }));
  }

  removeCartLine(lineId: number): void {
    this.state.update((state) => ({
      ...state,
      cart: state.cart.filter((line) => line.id !== lineId)
    }));
  }

  clearCart(): void {
    this.state.update((state) => ({
      ...state,
      cart: []
    }));
  }

  getModeCapabilities(mode: StorefrontMode = this.mode()): { cartEnabled: boolean; checkoutEnabled: boolean } {
    return {
      cartEnabled: mode === 'retail-store',
      checkoutEnabled: mode === 'retail-store'
    };
  }

  isPurchasable(mode: StorefrontMode, item: { modeAvailability: { retailStore: boolean; supplierPreview: boolean } }): boolean {
    return mode === 'retail-store'
      ? item.modeAvailability.retailStore
      : item.modeAvailability.supplierPreview;
  }

  private buildCatalogView(
    items: StorefrontCatalogItem[],
    mode: StorefrontMode,
    category: CatalogCategoryId
  ): StorefrontCatalogViewItem[] {
    return [...items]
      .filter((item) => item.category === category)
      .filter((item) => this.isPurchasable(mode, item))
      .sort((left, right) => {
        const leftRank = left.availability.origin === 'own' ? 0 : 1;
        const rightRank = right.availability.origin === 'own' ? 0 : 1;

        if (leftRank !== rightRank) {
          return leftRank - rightRank;
        }

        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }

        return left.brand.localeCompare(right.brand);
      })
      .map((item) => ({
        ...item,
        priorityRank: item.availability.origin === 'own' ? 0 : 1,
        availabilityBadge: item.availability.label
      }));
  }

  private buildPdpView(item: StorefrontPdpItem, mode: StorefrontMode): StorefrontPdpViewItem {
    return {
      ...item,
      priorityRank: item.availability.origin === 'own' ? 0 : 1,
      availabilityBadge: item.availability.label,
      options: item.options.filter((option) => this.isPurchasable(mode, option))
    };
  }

  private buildCartView(
    items: StorefrontCartLine[],
    mode: StorefrontMode
  ): StorefrontCartViewLine[] {
    return items
      .filter((item) => this.isPurchasable(mode, item))
      .map((item) => ({
        ...item,
        lineTotal: item.quantity * item.unitPrice
      }));
  }
}
