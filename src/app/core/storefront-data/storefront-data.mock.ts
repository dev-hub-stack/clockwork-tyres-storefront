import {
  StorefrontAddress,
  StorefrontCatalogItem,
  StorefrontCartLine,
  StorefrontDataState,
  StorefrontModeAvailability,
  StorefrontOrder,
  StorefrontPdpItem,
  StorefrontProfile
} from './storefront-data.models';

const retailAvailability = (origin: 'own' | 'supplier', quantity: number): StorefrontModeAvailability => ({
  retailStore: true,
  supplierPreview: true
});

const ownStockAvailability = (quantity: number) => ({
  origin: 'own' as const,
  label: 'in stock',
  quantity,
  showQuantity: quantity <= 4,
  supplierCount: 0
});

const supplierStockAvailability = (quantity: number, supplierCount: number) => ({
  origin: 'supplier' as const,
  label: 'available',
  quantity,
  showQuantity: quantity <= 4,
  supplierCount
});

const catalogItems: StorefrontCatalogItem[] = [
  {
    sku: 'CW-TYR-001',
    slug: 'michelin-pilot-sport-4s-325-30r21',
    brand: 'Michelin',
    model: 'Pilot Sport 4S',
    subtitle: 'Premium summer tyre',
    category: 'tyres',
    size: '325/30R21',
    price: 375,
    compareAtPrice: 450,
    image: '/assets/img/tire-go.jpg',
    availability: ownStockAvailability(4),
    modeAvailability: retailAvailability('own', 4),
    featured: true
  },
  {
    sku: 'CW-TYR-002',
    slug: 'pirelli-p-zero-285-45r21',
    brand: 'Pirelli',
    model: 'P Zero',
    subtitle: 'Performance SUV fitment',
    category: 'tyres',
    size: '285/45R21',
    price: 390,
    compareAtPrice: 430,
    image: '/assets/img/ty2.png',
    availability: ownStockAvailability(8),
    modeAvailability: retailAvailability('own', 8),
    featured: true
  },
  {
    sku: 'CW-TYR-003',
    slug: 'continental-sportcontact-7-255-35r19',
    brand: 'Continental',
    model: 'SportContact 7',
    subtitle: 'Daily-driver premium fitment',
    category: 'tyres',
    size: '255/35R19',
    price: 362,
    compareAtPrice: 410,
    image: '/assets/img/ty3.png',
    availability: supplierStockAvailability(3, 7),
    modeAvailability: retailAvailability('supplier', 3),
    featured: false
  },
  {
    sku: 'CW-TYR-004',
    slug: 'bridgestone-potenza-sport-265-40r20',
    brand: 'Bridgestone',
    model: 'Potenza Sport',
    subtitle: 'Supplier-backed stock',
    category: 'tyres',
    size: '265/40R20',
    price: 344,
    compareAtPrice: 390,
    image: '/assets/img/ty1.png',
    availability: supplierStockAvailability(2, 5),
    modeAvailability: retailAvailability('supplier', 2),
    featured: false
  }
];

const pdp: Record<string, StorefrontPdpItem> = {
  'michelin-pilot-sport-4s-325-30r21': {
    ...catalogItems[0],
    description: 'High-performance summer tyre with predictable handling and premium road feedback.',
    gallery: ['/assets/img/tire-go.jpg', '/assets/img/ty1.png', '/assets/img/ty2.png', '/assets/img/ty3.png'],
    fits: ['BMW M3 Competition', 'Audi RS6 Avant', 'Porsche 911 Carrera'],
    specifications: [
      { label: 'Size', value: '325/30R21' },
      { label: 'Load Index', value: '108' },
      { label: 'Speed Rating', value: 'Y' },
      { label: 'Season', value: 'Summer' },
      { label: 'Run Flat', value: 'No' },
      { label: 'Origin', value: 'France' }
    ],
    options: [
      {
        sku: 'CW-TYR-001',
        slug: 'michelin-pilot-sport-4s-325-30r21',
        size: '325/30R21',
        loadIndex: '108',
        speedRating: 'Y',
        season: 'Summer',
        availability: ownStockAvailability(4),
        modeAvailability: retailAvailability('own', 4)
      },
      {
        sku: 'CW-TYR-001A',
        slug: 'michelin-pilot-sport-4s-325-30r21',
        size: '315/30R21',
        loadIndex: '105',
        speedRating: 'Y',
        season: 'Summer',
        availability: supplierStockAvailability(3, 4),
        modeAvailability: retailAvailability('supplier', 3)
      }
    ],
    relatedSkus: ['CW-TYR-002', 'CW-TYR-003']
  },
  'pirelli-p-zero-285-45r21': {
    ...catalogItems[1],
    description: 'OEM-inspired sports performance tyre for SUVs and luxury vehicles.',
    gallery: ['/assets/img/ty2.png', '/assets/img/tire-go.jpg', '/assets/img/ty3.png'],
    fits: ['Mercedes-AMG G63', 'Lamborghini Urus', 'Range Rover Sport'],
    specifications: [
      { label: 'Size', value: '285/45R21' },
      { label: 'Load Index', value: '113' },
      { label: 'Speed Rating', value: 'W' },
      { label: 'Season', value: 'Summer' },
      { label: 'Run Flat', value: 'Yes' },
      { label: 'Origin', value: 'Italy' }
    ],
    options: [
      {
        sku: 'CW-TYR-002',
        slug: 'pirelli-p-zero-285-45r21',
        size: '285/45R21',
        loadIndex: '113',
        speedRating: 'W',
        season: 'Summer',
        availability: ownStockAvailability(8),
        modeAvailability: retailAvailability('own', 8)
      },
      {
        sku: 'CW-TYR-002B',
        slug: 'pirelli-p-zero-285-45r21',
        size: '305/35R23',
        loadIndex: '111',
        speedRating: 'Y',
        season: 'Summer',
        availability: supplierStockAvailability(2, 6),
        modeAvailability: retailAvailability('supplier', 2)
      }
    ],
    relatedSkus: ['CW-TYR-001', 'CW-TYR-004']
  },
  'continental-sportcontact-7-255-35r19': {
    ...catalogItems[2],
    description: 'Premium handling tyre for daily-driven performance vehicles.',
    gallery: ['/assets/img/ty3.png', '/assets/img/tire-go.jpg'],
    fits: ['Volkswagen Golf R', 'Audi S3', 'BMW 330i M Sport'],
    specifications: [
      { label: 'Size', value: '255/35R19' },
      { label: 'Load Index', value: '96' },
      { label: 'Speed Rating', value: 'Y' },
      { label: 'Season', value: 'Summer' },
      { label: 'Run Flat', value: 'No' },
      { label: 'Origin', value: 'Germany' }
    ],
    options: [
      {
        sku: 'CW-TYR-003',
        slug: 'continental-sportcontact-7-255-35r19',
        size: '255/35R19',
        loadIndex: '96',
        speedRating: 'Y',
        season: 'Summer',
        availability: supplierStockAvailability(3, 7),
        modeAvailability: retailAvailability('supplier', 3)
      },
      {
        sku: 'CW-TYR-003A',
        slug: 'continental-sportcontact-7-255-35r19',
        size: '275/30R20',
        loadIndex: '97',
        speedRating: 'Y',
        season: 'Summer',
        availability: supplierStockAvailability(2, 5),
        modeAvailability: retailAvailability('supplier', 2)
      }
    ],
    relatedSkus: ['CW-TYR-001', 'CW-TYR-002']
  },
  'bridgestone-potenza-sport-265-40r20': {
    ...catalogItems[3],
    description: 'Supplier-backed fitment with strong wet grip and responsive steering feel.',
    gallery: ['/assets/img/ty1.png', '/assets/img/ty2.png'],
    fits: ['Audi SQ5', 'BMW X3 M', 'Mercedes-Benz GLE'],
    specifications: [
      { label: 'Size', value: '265/40R20' },
      { label: 'Load Index', value: '104' },
      { label: 'Speed Rating', value: 'Y' },
      { label: 'Season', value: 'Summer' },
      { label: 'Run Flat', value: 'No' },
      { label: 'Origin', value: 'Japan' }
    ],
    options: [
      {
        sku: 'CW-TYR-004',
        slug: 'bridgestone-potenza-sport-265-40r20',
        size: '265/40R20',
        loadIndex: '104',
        speedRating: 'Y',
        season: 'Summer',
        availability: supplierStockAvailability(2, 5),
        modeAvailability: retailAvailability('supplier', 2)
      }
    ],
    relatedSkus: ['CW-TYR-001', 'CW-TYR-003']
  }
};

const profile: StorefrontProfile = {
  businessName: 'Al Noor Tyres Trading',
  email: 'orders@alnoortyres.ae',
  phone: '+971 50 123 4567',
  country: 'UAE',
  accountType: 'both',
  wholesaleEnabled: true,
  retailEnabled: true,
  subscription: 'premium-retailer'
};

const addresses: StorefrontAddress[] = [
  {
    id: 1,
    nickname: 'Warehouse Office',
    businessName: 'Al Noor Tyres Trading',
    address: 'Al Quoz Industrial Area 3',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    zip: '11111',
    phone: '+971 50 123 4567'
  },
  {
    id: 2,
    nickname: 'Retail Showroom',
    businessName: 'Al Noor Tyres Trading',
    address: 'Mussafah M12',
    city: 'Abu Dhabi',
    state: 'Abu Dhabi',
    country: 'UAE',
    zip: '22222',
    phone: '+971 50 765 4321'
  }
];

const cart: StorefrontCartLine[] = [
  {
    id: 1,
    sku: 'CW-TYR-001',
    slug: 'michelin-pilot-sport-4s-325-30r21',
    title: 'Michelin Pilot Sport 4S',
    size: '325/30R21',
    quantity: 2,
    unitPrice: 375,
    image: '/assets/img/tire-go.jpg',
    origin: 'own',
    availabilityLabel: 'in stock',
    modeAvailability: retailAvailability('own', 4)
  },
  {
    id: 2,
    sku: 'CW-TYR-003',
    slug: 'continental-sportcontact-7-255-35r19',
    title: 'Continental SportContact 7',
    size: '255/35R19',
    quantity: 1,
    unitPrice: 362,
    image: '/assets/img/ty3.png',
    origin: 'supplier',
    availabilityLabel: 'available',
    modeAvailability: retailAvailability('supplier', 3)
  }
];

const orders: StorefrontOrder[] = [
  {
    id: 'CW-10342',
    status: 'processing',
    createdAt: '2026-03-20',
    supplierName: 'Michelin Gulf',
    trackingNumber: 'CW10342AE',
    billing: {
      businessName: 'Al Noor Tyres Trading',
      address: 'Al Quoz Industrial Area 3',
      city: 'Dubai',
      country: 'UAE',
      phone: '+971 50 123 4567'
    },
    shipping: {
      businessName: 'Al Noor Tyres Trading',
      address: 'Al Quoz Industrial Area 3',
      city: 'Dubai',
      country: 'UAE',
      phone: '+971 50 123 4567'
    },
    lines: [
      {
        sku: 'CW-TYR-001',
        title: 'Michelin Pilot Sport 4S',
        size: '325/30R21',
        quantity: 2,
        unitPrice: 375,
        origin: 'own'
      }
    ],
    subtotal: 750,
    shippingAmount: 25,
    vat: 38,
    total: 813
  },
  {
    id: 'CW-10301',
    status: 'shipped',
    createdAt: '2026-03-14',
    supplierName: 'Pirelli Middle East',
    trackingNumber: 'CW10301AE',
    billing: {
      businessName: 'Al Noor Tyres Trading',
      address: 'Mussafah M12',
      city: 'Abu Dhabi',
      country: 'UAE',
      phone: '+971 50 765 4321'
    },
    shipping: {
      businessName: 'Al Noor Tyres Trading',
      address: 'Mussafah M12',
      city: 'Abu Dhabi',
      country: 'UAE',
      phone: '+971 50 765 4321'
    },
    lines: [
      {
        sku: 'CW-TYR-002',
        title: 'Pirelli P Zero',
        size: '285/45R21',
        quantity: 1,
        unitPrice: 390,
        origin: 'own'
      }
    ],
    subtotal: 390,
    shippingAmount: 25,
    vat: 20,
    total: 435
  }
];

export const storefrontMockState: StorefrontDataState = {
  mode: 'retail-store',
  catalog: catalogItems,
  pdp,
  cart,
  profile,
  addresses,
  orders
};
