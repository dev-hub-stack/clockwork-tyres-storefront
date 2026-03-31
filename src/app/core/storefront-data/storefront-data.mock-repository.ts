import { Injectable, signal } from '@angular/core';
import { CatalogCategoryId } from '../catalog-categories';
import {
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

const cloneState = (): StorefrontDataState => structuredClone(storefrontMockState);

@Injectable({
  providedIn: 'root'
})
export class InMemoryStorefrontDataRepository implements StorefrontDataRepository {
  private readonly stateSignal = signal<StorefrontDataState>(cloneState());

  readonly state = this.stateSignal.asReadonly();

  async hydrateWorkspace(_accountKey: string | number | null, _force = false): Promise<void> {
    return Promise.resolve();
  }

  restoreWorkspaceFallback(): void {
    const fallback = cloneState();

    this.stateSignal.update((state) => ({
      ...state,
      profile: fallback.profile,
      addresses: fallback.addresses,
      orders: fallback.orders
    }));
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
        return {
          ...state,
          cart: state.cart.map((cartLine) =>
            cartLine.sku === line.sku
              ? { ...cartLine, quantity: cartLine.quantity + Math.max(1, line.quantity) }
              : cartLine
          )
        };
      }

      const nextId = state.cart.reduce((maxId, cartLine) => Math.max(maxId, cartLine.id), 0) + 1;

      return {
        ...state,
        cart: [...state.cart, { ...line, id: nextId }]
      };
    });
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

  async submitOrder(
    payload: StorefrontCheckoutPayload,
    _accountKey: string | number | null
  ): Promise<StorefrontCheckoutResult | null> {
    const nextOrderId = `CW-MOCK-${Date.now()}`;

    this.stateSignal.update((state) => ({
      ...state,
      cart: [],
      orders: [
        {
          id: nextOrderId,
          status: 'pending',
          createdAt: new Date().toISOString().slice(0, 10),
          supplierName: state.profile.businessName,
          trackingNumber: '',
          billing: {
            businessName: payload.billing.businessName,
            address: payload.billing.address,
            city: payload.billing.city,
            country: payload.billing.country,
            phone: payload.billing.phone
          },
          shipping: {
            businessName: payload.shipping.businessName,
            address: payload.shipping.address,
            city: payload.shipping.city,
            country: payload.shipping.country,
            phone: payload.shipping.phone
          },
          lines: payload.items.map((item) => ({
            sku: item.sku,
            title: item.title,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            origin: item.origin
          })),
          subtotal: payload.items.reduce(
            (total, item) => total + item.quantity * item.unitPrice,
            0
          ),
          shippingAmount: 25,
          vat: payload.items.reduce(
            (total, item) => total + item.quantity * item.unitPrice,
            0
          ) * 0.05,
          total:
            payload.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0) * 1.05 + 25
        },
        ...state.orders
      ]
    }));

    const latestOrder = this.stateSignal().orders[0];

    return {
      id: Number(Date.now()),
      orderNumber: latestOrder.id,
      status: latestOrder.status,
      total: latestOrder.total
    };
  }

  reset(): void {
    this.stateSignal.set(cloneState());
  }

  getOrders(): StorefrontOrder[] {
    return this.stateSignal().orders;
  }
}
