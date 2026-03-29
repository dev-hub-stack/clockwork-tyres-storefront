import { Injectable, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
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

const cloneState = (): StorefrontDataState => structuredClone(storefrontMockState);

@Injectable({
  providedIn: 'root'
})
export class InMemoryStorefrontDataRepository implements StorefrontDataRepository {
  private readonly stateSignal = signal<StorefrontDataState>(cloneState());

  readonly state = this.stateSignal.asReadonly();

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

  updateCartLineQuantity(lineId: number, quantity: number): void {
    this.stateSignal.update((state) => ({
      ...state,
      cart: state.cart.map((line) =>
        line.id === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
      )
    }));
  }

  removeCartLine(lineId: number): void {
    this.stateSignal.update((state) => ({
      ...state,
      cart: state.cart.filter((line) => line.id !== lineId)
    }));
  }

  clearCart(): void {
    this.stateSignal.update((state) => ({
      ...state,
      cart: []
    }));
  }

  reset(): void {
    this.stateSignal.set(cloneState());
  }

  getOrders(): StorefrontOrder[] {
    return this.stateSignal().orders;
  }
}
