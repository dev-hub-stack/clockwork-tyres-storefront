import { Injectable, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
  StorefrontAddress,
  StorefrontDataState,
  StorefrontMode,
  StorefrontOrder,
  StorefrontProfile
} from './storefront-data.models';
import { storefrontMockState } from './storefront-data.mock';
import { StorefrontDataRepository } from './storefront-data.repository';

const cloneState = (): StorefrontDataState => structuredClone(storefrontMockState);

@Injectable({
  providedIn: 'root'
})
export class InMemoryStorefrontDataRepository implements StorefrontDataRepository {
  private readonly stateSignal = signal<StorefrontDataState>(cloneState());

  readonly state = this.stateSignal.asReadonly();

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
