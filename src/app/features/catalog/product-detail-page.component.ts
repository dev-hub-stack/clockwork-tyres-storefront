import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import {
  StorefrontDataService,
  StorefrontPdpViewItem,
  StorefrontSpecificationRow
} from '../../core/storefront-data';
import { StorefrontModeStore } from '../../core/storefront-mode';
import { StorefrontCatalogSyncService } from '../../core/storefront-data/storefront-catalog-sync.service';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);
  private readonly catalogSync = inject(StorefrontCatalogSyncService);

  private readonly currentSlug = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('sku') ?? 'michelin-pilot-sport-4s-325-30r21')
    ),
    { initialValue: 'michelin-pilot-sport-4s-325-30r21' }
  );

  protected readonly activeImageIndex = signal(0);
  protected readonly quantity = signal(1);
  protected readonly selectedTab = signal('');
  protected readonly productStatus = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
  private productRequestSequence = 0;

  protected readonly addToCartCta = this.storefrontMode.ctaState('add-to-cart');
  protected readonly modeViewModel = this.storefrontMode.viewModel;

  protected readonly product = computed<StorefrontPdpViewItem | undefined>(() =>
    this.storefrontData.getProductBySlug(this.currentSlug())
  );

  protected readonly activeImage = computed(
    () => this.product()?.gallery[this.activeImageIndex()] ?? this.product()?.gallery[0] ?? '/assets/img/tire-go.jpg'
  );

  protected readonly activeCategoryLabel = computed(() => {
    const category = this.product()?.category ?? 'tyres';

    return category === 'wheels' ? 'Wheels' : 'Tyres';
  });

  protected readonly priceBreakdown = computed(() => {
    const product = this.product();

    if (!product) {
      return {
        compareAtPrice: null,
        price: 0,
        availabilityOrigin: 'supplier' as const,
        supplierCount: 0
      };
    }

    return {
      compareAtPrice: product.compareAtPrice ?? null,
      price: product.price,
      availabilityOrigin: product.availability.origin,
      supplierCount: product.availability.supplierCount
    };
  });

  protected readonly availabilitySummary = computed(() => {
    const product = this.product();

    if (!product) {
      return {
        label: 'unavailable',
        quantity: 0,
        showQuantity: false,
        supplierCount: 0,
        origin: 'supplier' as const
      };
    }

    return {
      label: product.availabilityBadge,
      quantity: product.availability.quantity,
      showQuantity: product.availability.showQuantity,
      supplierCount: product.availability.supplierCount,
      origin: product.availability.origin
    };
  });

  protected readonly sizeTabs = computed(() => {
    const uniqueTabs = new Set((this.product()?.options ?? []).map((option) => this.getRimSizeLabel(option.size)));
    return [...uniqueTabs];
  });

  protected readonly filteredOptions = computed(() => {
    const selectedTab = this.selectedTab();

    return (this.product()?.options ?? []).filter(
      (option) => !selectedTab || this.getRimSizeLabel(option.size) === selectedTab
    );
  });

  protected readonly specificationRows = computed(() => {
    const rows: StorefrontSpecificationRow[][] = [];
    const specifications = this.product()?.specifications ?? [];

    for (let index = 0; index < specifications.length; index += 2) {
      rows.push(specifications.slice(index, index + 2));
    }

    return rows;
  });

  protected readonly heroStats = computed(() => {
    const product = this.product();

    if (!product) {
      return [
        { label: 'Category', value: this.activeCategoryLabel() },
        { label: 'Size', value: '--' },
        { label: 'SKU', value: '--' },
        { label: 'Supplier stock', value: '0' }
      ];
    }

    return [
      { label: 'Category', value: this.activeCategoryLabel() },
      { label: 'Size', value: product.size },
      { label: 'SKU', value: product.sku },
      { label: 'Supplier stock', value: `${product.availability.supplierCount}` }
    ];
  });

  protected readonly isTyreLaunch = computed(() => (this.product()?.category ?? 'tyres') === 'tyres');

  constructor() {
    effect(() => {
      void this.loadProduct();
    });

    effect(() => {
      if (!this.product()) {
        return;
      }

      const tabs = this.sizeTabs();

      this.activeImageIndex.set(0);
      this.quantity.set(1);
      this.selectedTab.set(tabs[0] ?? '');
    });
  }

  protected setActiveImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  protected decrementQuantity(): void {
    this.quantity.update((quantity) => Math.max(1, quantity - 1));
  }

  protected incrementQuantity(): void {
    this.quantity.update((quantity) => quantity + 1);
  }

  protected selectTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  protected getRimSizeLabel(size: string): string {
    const rimSize = size.split('R')[1];
    return rimSize ? `${rimSize}"` : size;
  }

  protected formatAvailabilityText(): string {
    const summary = this.availabilitySummary();

    if (summary.showQuantity) {
      return `${summary.label} (${summary.quantity})`;
    }

    return summary.label;
  }

  protected getQuantityCopy(): string {
    const summary = this.availabilitySummary();

    if (summary.origin === 'own') {
      return 'Own stock';
    }

    return 'Approved supplier stock';
  }

  protected addCurrentProductToCart(): void {
    if (!this.addToCartCta().enabled) {
      return;
    }

    const product = this.product();

    if (!product) {
      return;
    }

    this.storefrontData.addCartLine({
      sku: product.sku,
      slug: product.slug,
      title: `${product.brand} ${product.model}`.trim(),
      size: product.size,
      quantity: this.quantity(),
      unitPrice: product.price,
      image: product.image,
      origin: product.availability.origin,
      availabilityLabel: product.availability.label,
      modeAvailability: product.modeAvailability
    });
  }

  protected retryProduct(): void {
    void this.loadProduct();
  }

  private async loadProduct(): Promise<void> {
    const slug = this.currentSlug();
    const mode = this.storefrontData.mode();
    const category = this.storefrontData.activeCategory();
    const requestId = ++this.productRequestSequence;

    this.productStatus.set('loading');

    try {
      await this.catalogSync.syncProduct(slug, mode, category);

      if (requestId !== this.productRequestSequence) {
        return;
      }

      this.productStatus.set(
        this.storefrontData.getProductBySlug(slug, mode, category) ? 'ready' : 'empty'
      );
    } catch {
      if (requestId !== this.productRequestSequence) {
        return;
      }

      this.productStatus.set('error');
    }
  }
}
