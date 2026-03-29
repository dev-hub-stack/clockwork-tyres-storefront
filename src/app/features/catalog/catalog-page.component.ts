import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorefrontDataService } from '../../core/storefront-data';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
  private readonly storefrontData = inject(StorefrontDataService);

  protected readonly products = this.storefrontData.catalog;
  protected readonly cartEnabled = this.storefrontData.cartEnabled;
}
