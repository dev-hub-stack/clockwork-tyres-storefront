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

  private readonly currentSlug = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('sku') ?? 'michelin-pilot-sport-4s-325-30r21')
    ),
    { initialValue: 'michelin-pilot-sport-4s-325-30r21' }
  );

  protected readonly activeImageIndex = signal(0);
  protected readonly quantity = signal(1);
  protected readonly selectedTab = signal('');

  protected readonly addToCartCta = this.storefrontMode.ctaState('add-to-cart');
  protected readonly modeViewModel = this.storefrontMode.viewModel;

  protected readonly product = computed<StorefrontPdpViewItem>(() => {
    return (
      this.storefrontData.getProductBySlug(this.currentSlug()) ??
      this.storefrontData.getProductBySlug('michelin-pilot-sport-4s-325-30r21')!
    );
  });

  protected readonly activeImage = computed(
    () => this.product().gallery[this.activeImageIndex()] ?? this.product().gallery[0]
  );

  protected readonly sizeTabs = computed(() => {
    const uniqueTabs = new Set(this.product().options.map((option) => this.getRimSizeLabel(option.size)));
    return [...uniqueTabs];
  });

  protected readonly filteredOptions = computed(() => {
    const selectedTab = this.selectedTab();

    return this.product().options.filter(
      (option) => !selectedTab || this.getRimSizeLabel(option.size) === selectedTab
    );
  });

  protected readonly specificationRows = computed(() => {
    const rows: StorefrontSpecificationRow[][] = [];
    const specifications = this.product().specifications;

    for (let index = 0; index < specifications.length; index += 2) {
      rows.push(specifications.slice(index, index + 2));
    }

    return rows;
  });

  constructor() {
    effect(() => {
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
}
