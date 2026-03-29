import { computed, inject, Injectable } from '@angular/core';
import {
  StorefrontAddress,
  StorefrontCartViewLine,
  StorefrontCatalogViewItem,
  StorefrontMode,
  StorefrontOrder,
  StorefrontPdpViewItem,
  StorefrontProfile
} from './storefront-data.models';
import { StorefrontDataStore } from './storefront-data.store';

@Injectable({
  providedIn: 'root'
})
export class StorefrontDataService {
  private readonly store = inject(StorefrontDataStore);

  readonly mode = this.store.mode;
  readonly profile = this.store.profile;
  readonly addresses = this.store.addresses;
  readonly orders = this.store.orders;
  readonly catalog = this.store.catalog;
  readonly cart = this.store.cart;

  readonly checkoutEnabled = computed(() => this.store.getModeCapabilities(this.mode()).checkoutEnabled);
  readonly cartEnabled = computed(() => this.store.getModeCapabilities(this.mode()).cartEnabled);

  setMode(mode: StorefrontMode): void {
    this.store.setMode(mode);
  }

  getCatalogItems(mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem[] {
    return this.store.getCatalogItems(mode);
  }

  getFeaturedCatalogItems(mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem[] {
    return this.store.getFeaturedCatalogItems(mode);
  }

  getProductBySku(sku: string, mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem | undefined {
    return this.store.getProductBySku(sku, mode);
  }

  getProductBySlug(sku: string, mode: StorefrontMode = this.mode()): StorefrontPdpViewItem | undefined {
    return this.store.getProductBySlug(sku, mode);
  }

  getCartItems(mode: StorefrontMode = this.mode()): StorefrontCartViewLine[] {
    return this.store.getCartItems(mode);
  }

  getProfile(): StorefrontProfile {
    return this.store.getProfile();
  }

  updateProfile(profile: StorefrontProfile): void {
    this.store.updateProfile(profile);
  }

  getAddresses(): StorefrontAddress[] {
    return this.store.getAddresses();
  }

  addAddress(address: StorefrontAddress): void {
    this.store.addAddress(address);
  }

  updateAddress(addressId: number, address: StorefrontAddress): void {
    this.store.updateAddress(addressId, address);
  }

  deleteAddress(addressId: number): void {
    this.store.deleteAddress(addressId);
  }

  getOrders(): StorefrontOrder[] {
    return this.store.getOrders();
  }

  updateCartLineQuantity(lineId: number, quantity: number): void {
    this.store.updateCartLineQuantity(lineId, quantity);
  }

  removeCartLine(lineId: number): void {
    this.store.removeCartLine(lineId);
  }

  clearCart(): void {
    this.store.clearCart();
  }
}
