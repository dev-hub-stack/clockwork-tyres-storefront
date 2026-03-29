import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

type SpecificationRow = {
  leftLabel: string;
  leftValue: string;
  rightLabel?: string;
  rightValue?: string;
};

type ProductOption = {
  sku: string;
  pattern: string;
  size: string;
  loadIndex: string;
  speedRating: string;
  season: string;
  stock: string;
  status: 'in-stock' | 'out-of-stock';
  slug: string;
  tab: string;
};

type DetailProduct = {
  brand: string;
  model: string;
  subline: string;
  sku: string;
  msrp: number;
  yourPrice: number;
  salePrice?: number;
  stockText: string;
  images: string[];
  fits: string[];
  sizeTabs: string[];
  specifications: SpecificationRow[];
  options: ProductOption[];
};

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly currentSku = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('sku') ?? 'cw-tyr-001')),
    { initialValue: 'cw-tyr-001' }
  );

  protected readonly activeImageIndex = signal(0);
  protected readonly quantity = signal(1);
  protected readonly selectedTab = signal('21"');

  private readonly products: Record<string, DetailProduct> = {
    'cw-tyr-001': {
      brand: 'Michelin',
      model: 'Pilot Sport 4S',
      subline: 'Ultra-high performance summer tyre',
      sku: 'CW-TYR-001',
      msrp: 450,
      yourPrice: 375,
      salePrice: 349,
      stockText: '4 in stock',
      images: [
        '/assets/img/tire-go.jpg',
        '/assets/img/ty1.png',
        '/assets/img/ty2.png',
        '/assets/img/ty3.png'
      ],
      fits: ['2021 BMW M3 Competition', '2022 Audi RS6 Avant', '2023 Porsche 911 Carrera'],
      sizeTabs: ['21"', '22"'],
      specifications: [
        {
          leftLabel: 'Size',
          leftValue: '325/30R21',
          rightLabel: 'Load Index',
          rightValue: '108'
        },
        {
          leftLabel: 'Speed Rating',
          leftValue: 'Y',
          rightLabel: 'Pattern',
          rightValue: 'Directional'
        },
        {
          leftLabel: 'Season',
          leftValue: 'Summer',
          rightLabel: 'Run Flat',
          rightValue: 'No'
        },
        {
          leftLabel: 'Origin',
          leftValue: 'France',
          rightLabel: 'Warranty',
          rightValue: 'Manufacturer warranty'
        },
        {
          leftLabel: 'Noise Rating',
          leftValue: '72 dB',
          rightLabel: 'Wet Grip',
          rightValue: 'A'
        }
      ],
      options: [
        {
          sku: 'CW-TYR-001',
          pattern: 'Pilot Sport 4S',
          size: '325/30R21',
          loadIndex: '108',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'In Stock',
          status: 'in-stock',
          slug: 'cw-tyr-001',
          tab: '21"'
        },
        {
          sku: 'CW-TYR-004',
          pattern: 'Pilot Sport 4S',
          size: '315/30R21',
          loadIndex: '105',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'In Stock',
          status: 'in-stock',
          slug: 'cw-tyr-001',
          tab: '21"'
        },
        {
          sku: 'CW-TYR-007',
          pattern: 'Pilot Sport 4S',
          size: '335/25R22',
          loadIndex: '105',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'Out Of Stock',
          status: 'out-of-stock',
          slug: 'cw-tyr-001',
          tab: '22"'
        }
      ]
    },
    'cw-tyr-002': {
      brand: 'Pirelli',
      model: 'P Zero',
      subline: 'OEM-inspired sports performance tyre',
      sku: 'CW-TYR-002',
      msrp: 430,
      yourPrice: 390,
      stockText: '8 in stock',
      images: [
        '/assets/img/tire-go.jpg',
        '/assets/img/ty2.png',
        '/assets/img/ty3.png'
      ],
      fits: ['2024 Mercedes-AMG G63', '2022 Lamborghini Urus', '2023 Range Rover Sport'],
      sizeTabs: ['21"', '23"'],
      specifications: [
        {
          leftLabel: 'Size',
          leftValue: '285/45R21',
          rightLabel: 'Load Index',
          rightValue: '113'
        },
        {
          leftLabel: 'Speed Rating',
          leftValue: 'W',
          rightLabel: 'Pattern',
          rightValue: 'Asymmetric'
        },
        {
          leftLabel: 'Season',
          leftValue: 'Summer',
          rightLabel: 'Run Flat',
          rightValue: 'Yes'
        },
        {
          leftLabel: 'Origin',
          leftValue: 'Italy',
          rightLabel: 'Warranty',
          rightValue: 'Manufacturer warranty'
        },
        {
          leftLabel: 'Noise Rating',
          leftValue: '71 dB',
          rightLabel: 'Wet Grip',
          rightValue: 'A'
        }
      ],
      options: [
        {
          sku: 'CW-TYR-002',
          pattern: 'P Zero',
          size: '285/45R21',
          loadIndex: '113',
          speedRating: 'W',
          season: 'Summer',
          stock: 'In Stock',
          status: 'in-stock',
          slug: 'cw-tyr-002',
          tab: '21"'
        },
        {
          sku: 'CW-TYR-009',
          pattern: 'P Zero',
          size: '305/35R23',
          loadIndex: '111',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'In Stock',
          status: 'in-stock',
          slug: 'cw-tyr-002',
          tab: '23"'
        }
      ]
    },
    'cw-tyr-003': {
      brand: 'Continental',
      model: 'SportContact 7',
      subline: 'Daily-driven premium handling tyre',
      sku: 'CW-TYR-003',
      msrp: 410,
      yourPrice: 362,
      stockText: '2 in stock',
      images: [
        '/assets/img/tire-go.jpg',
        '/assets/img/ty1.png',
        '/assets/img/ty3.png'
      ],
      fits: ['2021 Volkswagen Golf R', '2022 Audi S3', '2023 BMW 330i M Sport'],
      sizeTabs: ['19"', '20"'],
      specifications: [
        {
          leftLabel: 'Size',
          leftValue: '255/35R19',
          rightLabel: 'Load Index',
          rightValue: '96'
        },
        {
          leftLabel: 'Speed Rating',
          leftValue: 'Y',
          rightLabel: 'Pattern',
          rightValue: 'Asymmetric'
        },
        {
          leftLabel: 'Season',
          leftValue: 'Summer',
          rightLabel: 'Run Flat',
          rightValue: 'No'
        },
        {
          leftLabel: 'Origin',
          leftValue: 'Germany',
          rightLabel: 'Warranty',
          rightValue: 'Manufacturer warranty'
        },
        {
          leftLabel: 'Noise Rating',
          leftValue: '72 dB',
          rightLabel: 'Wet Grip',
          rightValue: 'A'
        }
      ],
      options: [
        {
          sku: 'CW-TYR-003',
          pattern: 'SportContact 7',
          size: '255/35R19',
          loadIndex: '96',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'In Stock',
          status: 'in-stock',
          slug: 'cw-tyr-003',
          tab: '19"'
        },
        {
          sku: 'CW-TYR-010',
          pattern: 'SportContact 7',
          size: '275/30R20',
          loadIndex: '97',
          speedRating: 'Y',
          season: 'Summer',
          stock: 'Out Of Stock',
          status: 'out-of-stock',
          slug: 'cw-tyr-003',
          tab: '20"'
        }
      ]
    }
  };

  protected readonly product = computed(
    () => this.products[this.currentSku()] ?? this.products['cw-tyr-001']
  );

  protected readonly activeImage = computed(
    () => this.product().images[this.activeImageIndex()] ?? this.product().images[0]
  );

  protected readonly filteredOptions = computed(() =>
    this.product().options.filter((option) => option.tab === this.selectedTab())
  );

  constructor() {
    effect(() => {
      const nextProduct = this.product();
      this.activeImageIndex.set(0);
      this.quantity.set(1);
      this.selectedTab.set(nextProduct.sizeTabs[0] ?? '21"');
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
}
