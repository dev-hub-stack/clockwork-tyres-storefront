import { computed, inject, Injectable } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
  StorefrontCartLine,
  StorefrontCartViewLine,
  StorefrontCatalogItem,
  StorefrontCatalogViewItem,
  StorefrontAddress,
  StorefrontMode,
  StorefrontOrder,
  StorefrontPdpItem,
  StorefrontPdpViewItem,
  StorefrontProfile
} from './storefront-data.models';
import {
  STOREFRONT_DATA_REPOSITORY,
  StorefrontDataRepository
} from './storefront-data.repository';

@Injectable({
  providedIn: 'root'
})
export class StorefrontDataStore {
  private readonly repository: StorefrontDataRepository = inject(STOREFRONT_DATA_REPOSITORY);

  readonly mode = computed(() => this.repository.state().mode);
  readonly activeCategory = computed(() => this.repository.state().activeCategory);
  readonly profile = computed(() => this.repository.state().profile);
  readonly addresses = computed(() => this.repository.state().addresses);
  readonly orders = computed(() => this.repository.state().orders);
  readonly catalog = computed(() =>
    this.buildCatalogView(this.repository.state().catalog, this.mode(), this.activeCategory())
  );
  readonly cart = computed(() => this.buildCartView(this.repository.state().cart, this.mode()));

  setMode(mode: StorefrontMode): void {
    this.repository.setMode(mode);
  }

  setCategory(category: CatalogCategoryId): void {
    this.repository.setCategory(category);
  }

  getCatalogItems(
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontCatalogViewItem[] {
    return this.buildCatalogView(this.repository.state().catalog, mode, category);
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
    const item = this.repository.state().pdp[slug];

    if (!item || item.category !== category) {
      return undefined;
    }

    return this.buildPdpView(item, mode);
  }

  getCartItems(mode: StorefrontMode = this.mode()): StorefrontCartViewLine[] {
    return this.buildCartView(this.repository.state().cart, mode);
  }

  getProfile(): StorefrontProfile {
    return this.repository.state().profile;
  }

  updateProfile(profile: StorefrontProfile): void {
    this.repository.updateProfile(profile);
  }

  getAddresses(): StorefrontAddress[] {
    return this.repository.state().addresses;
  }

  addAddress(address: StorefrontAddress): void {
    this.repository.addAddress(address);
  }

  updateAddress(addressId: number, nextAddress: StorefrontAddress): void {
    this.repository.updateAddress(addressId, nextAddress);
  }

  deleteAddress(addressId: number): void {
    this.repository.deleteAddress(addressId);
  }

  getOrders(): StorefrontOrder[] {
    return this.repository.getOrders();
  }

  updateCartLineQuantity(lineId: number, quantity: number): void {
    this.repository.updateCartLineQuantity(lineId, quantity);
  }

  removeCartLine(lineId: number): void {
    this.repository.removeCartLine(lineId);
  }

  clearCart(): void {
    this.repository.clearCart();
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
