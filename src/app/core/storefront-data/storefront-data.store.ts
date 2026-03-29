import { computed, Injectable, signal } from '@angular/core';
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
  readonly profile = computed(() => this.state().profile);
  readonly addresses = computed(() => this.state().addresses);
  readonly orders = computed(() => this.state().orders);
  readonly catalog = computed(() => this.buildCatalogView(this.state().catalog, this.mode()));
  readonly cart = computed(() => this.buildCartView(this.state().cart, this.mode()));

  setMode(mode: StorefrontMode): void {
    this.state.update((state) => ({
      ...state,
      mode
    }));
  }

  getCatalogItems(mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem[] {
    return this.buildCatalogView(this.state().catalog, mode);
  }

  getFeaturedCatalogItems(mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem[] {
    return this.getCatalogItems(mode).filter((item) => item.featured);
  }

  getProductBySku(sku: string, mode: StorefrontMode = this.mode()): StorefrontCatalogViewItem | undefined {
    return this.getCatalogItems(mode).find((item) => item.sku === sku);
  }

  getProductBySlug(slug: string, mode: StorefrontMode = this.mode()): StorefrontPdpViewItem | undefined {
    const item = this.state().pdp[slug];

    return item ? this.buildPdpView(item, mode) : undefined;
  }

  getCartItems(mode: StorefrontMode = this.mode()): StorefrontCartViewLine[] {
    return this.buildCartView(this.state().cart, mode);
  }

  getProfile(): StorefrontProfile {
    return this.state().profile;
  }

  getAddresses(): StorefrontAddress[] {
    return this.state().addresses;
  }

  getOrders(): StorefrontOrder[] {
    return this.state().orders;
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
    mode: StorefrontMode
  ): StorefrontCatalogViewItem[] {
    return [...items]
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
