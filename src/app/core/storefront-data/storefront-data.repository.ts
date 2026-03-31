import { InjectionToken, Signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
  StorefrontAddress,
  StorefrontCartLineInput,
  StorefrontCheckoutPayload,
  StorefrontCheckoutResult,
  StorefrontDataState,
  StorefrontMode,
  StorefrontOrder,
  StorefrontProfile
} from './storefront-data.models';
import { StorefrontCatalogRepository } from './storefront-catalog.repository';

export interface StorefrontDataRepository extends StorefrontCatalogRepository {
  readonly state: Signal<StorefrontDataState>;

  hydrateWorkspace(accountKey: string | number | null, force?: boolean): Promise<void>;
  restoreWorkspaceFallback(): void;
  setMode(mode: StorefrontMode): void;
  setCategory(category: CatalogCategoryId): void;
  updateProfile(profile: StorefrontProfile): void;
  addAddress(address: StorefrontAddress): void;
  updateAddress(addressId: number, nextAddress: StorefrontAddress): void;
  deleteAddress(addressId: number): void;
  addCartLine(line: StorefrontCartLineInput): void;
  updateCartLineQuantity(lineId: number, quantity: number): void;
  removeCartLine(lineId: number): void;
  clearCart(): void;
  submitOrder(payload: StorefrontCheckoutPayload, accountKey: string | number | null): Promise<StorefrontCheckoutResult | null>;
  reset(): void;
  getOrders(): StorefrontOrder[];
}

export const STOREFRONT_DATA_REPOSITORY = new InjectionToken<StorefrontDataRepository>(
  'STOREFRONT_DATA_REPOSITORY'
);
