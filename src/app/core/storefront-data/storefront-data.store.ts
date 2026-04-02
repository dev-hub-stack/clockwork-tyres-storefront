import { computed, inject, Injectable } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
  StorefrontCartLine,
  StorefrontCartLineInput,
  StorefrontCheckoutPayload,
  StorefrontCheckoutResult,
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
import {
  resolveCatalogItemBySku,
  resolveCatalogItems,
} from './storefront-catalog.helpers';

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
  readonly catalogStatus = computed(() => this.repository.state().catalogStatus);
  readonly catalogError = computed(() => this.repository.state().catalogError);
  readonly workspaceStatus = computed(() => this.repository.state().workspaceStatus);
  readonly workspaceError = computed(() => this.repository.state().workspaceError);
  readonly catalog = computed(() =>
    this.buildCatalogView(
      this.repository.getCatalogItems(this.mode(), this.activeCategory()),
      this.mode(),
      this.activeCategory()
    )
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
    return this.buildCatalogView(this.repository.getCatalogItems(mode, category), mode, category);
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
    const item = resolveCatalogItemBySku(
      this.repository.getCatalogItems(mode, category),
      sku,
      mode,
      category
    );

    return item ? this.buildCatalogView([item], mode, category)[0] : undefined;
  }

  getProductBySlug(
    slug: string,
    mode: StorefrontMode = this.mode(),
    category: CatalogCategoryId = this.activeCategory()
  ): StorefrontPdpViewItem | undefined {
    const item = this.repository.getProductBySlug(slug, mode, category);
    if (!item) {
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

  addCartLine(line: StorefrontCartLineInput): void {
    this.repository.addCartLine(line);
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

  submitOrder(
    payload: StorefrontCheckoutPayload,
    accountKey: string | number | null
  ): Promise<StorefrontCheckoutResult | null> {
    return this.repository.submitOrder(payload, accountKey);
  }

  reset(): void {
    this.repository.reset();
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
    return resolveCatalogItems(items, mode, category)
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
