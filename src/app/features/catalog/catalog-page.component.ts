import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type CatalogProduct = {
  sku: string;
  slug: string;
  subtitle: string;
  size: string;
  stock: number;
  price: number;
  image: string;
};

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
  protected readonly products: CatalogProduct[] = [
    {
      sku: 'CW-TYR-001',
      slug: 'cw-tyr-001',
      subtitle: 'Pilot Sport 4S',
      size: '325/30R21',
      stock: 4,
      price: 375,
      image: '/assets/img/tire-go.jpg'
    },
    {
      sku: 'CW-TYR-002',
      slug: 'cw-tyr-002',
      subtitle: 'Pilot Sport 4S',
      size: '325/30R21',
      stock: 8,
      price: 375,
      image: '/assets/img/tire-go.jpg'
    },
    {
      sku: 'CW-TYR-003',
      slug: 'cw-tyr-003',
      subtitle: 'Pilot Sport 4S',
      size: '325/30R21',
      stock: 2,
      price: 375,
      image: '/assets/img/tire-go.jpg'
    }
  ];
}
