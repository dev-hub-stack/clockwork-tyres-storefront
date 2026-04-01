import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogCategoryService } from '../../core/catalog-categories';
import { FitmentService } from '../../core/fitment';
import { StorefrontCatalogViewItem, StorefrontDataService } from '../../core/storefront-data';
import { buildCatalogQueryParams } from '../../core/storefront-routes';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);
  private readonly storefrontData = inject(StorefrontDataService);

  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly products = this.storefrontData.catalog;
  protected readonly cartEnabled = this.storefrontData.cartEnabled;
  protected readonly productCount = computed(() => this.products().length);
  protected readonly catalogSummary = computed(() => {
    if (!this.activeCategory().enabled) {
      return 'Category structured for launch, but not enabled yet.';
    }

    return 'Merged own stock first, then approved supplier stock.';
  });
  protected readonly brandSuggestions = computed(() => {
    const brands = new Set(this.products().map(product => product.brand));
    return Array.from(brands).slice(0, 6);
  });
  protected readonly categoryDisabled = computed(() => !this.activeCategory().enabled);
  protected readonly isInteractive = signal(false);
  protected readonly searchSummaryChips = computed(() => {
    const summary = this.fitment.searchSummary();
    return summary.length ? summary : [this.activeCategory().label];
  });
  protected readonly productQueryParams = computed(() => {
    return buildCatalogQueryParams(this.activeCategory().id, this.fitment.searchMode());
  });

  constructor() {
    afterNextRender(() => {
      this.isInteractive.set(true);
    });
  }

  protected addToCart(product: StorefrontCatalogViewItem): void {
    if (!this.cartEnabled() || !this.isInteractive()) {
      return;
    }

    this.storefrontData.addCartLine({
      sku: product.sku,
      slug: product.slug,
      title: `${product.brand} ${product.model}`.trim(),
      size: product.size,
      quantity: 1,
      unitPrice: product.price,
      image: product.image,
      origin: product.availability.origin,
      availabilityLabel: product.availability.label,
      modeAvailability: product.modeAvailability
    });
  }
}
