import { CatalogCategoryId } from '../catalog-categories';

export type StorefrontMode = 'retail-store' | 'supplier-preview';

export type StockOrigin = 'own' | 'supplier';

export type OrderStatus = 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface StorefrontAvailability {
  origin: StockOrigin;
  label: string;
  quantity: number;
  showQuantity: boolean;
  supplierCount: number;
}

export interface StorefrontModeAvailability {
  retailStore: boolean;
  supplierPreview: boolean;
}

export interface StorefrontCatalogItem {
  sku: string;
  slug: string;
  brand: string;
  model: string;
  subtitle: string;
  category: CatalogCategoryId;
  size: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  availability: StorefrontAvailability;
  modeAvailability: StorefrontModeAvailability;
  featured?: boolean;
}

export interface StorefrontSpecificationRow {
  label: string;
  value: string;
}

export interface StorefrontProductOption {
  sku: string;
  slug: string;
  size: string;
  loadIndex: string;
  speedRating: string;
  season: string;
  availability: StorefrontAvailability;
  modeAvailability: StorefrontModeAvailability;
}

export interface StorefrontPdpItem extends StorefrontCatalogItem {
  description: string;
  gallery: string[];
  fits: string[];
  specifications: StorefrontSpecificationRow[];
  options: StorefrontProductOption[];
  relatedSkus: string[];
}

export interface StorefrontCartLine {
  id: number;
  sku: string;
  slug: string;
  title: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
  origin: StockOrigin;
  availabilityLabel: string;
  modeAvailability: StorefrontModeAvailability;
}

export interface StorefrontProfile {
  businessName: string;
  address: string;
  email: string;
  phone: string;
  country: string;
  licenseNumber: string;
  expiry: string;
  website: string;
  instagram: string;
  contactName: string;
  accountType: 'retailer' | 'supplier' | 'both';
  wholesaleEnabled: boolean;
  retailEnabled: boolean;
  subscription: string;
}

export interface StorefrontAddress {
  id: number;
  nickname: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}

export interface StorefrontOrderLine {
  sku: string;
  title: string;
  size: string;
  quantity: number;
  unitPrice: number;
  origin: StockOrigin;
}

export interface StorefrontOrderAddress {
  businessName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

export interface StorefrontOrder {
  id: string;
  status: OrderStatus;
  createdAt: string;
  supplierName: string;
  trackingNumber: string;
  billing: StorefrontOrderAddress;
  shipping: StorefrontOrderAddress;
  lines: StorefrontOrderLine[];
  subtotal: number;
  shippingAmount: number;
  vat: number;
  total: number;
}

export interface StorefrontDataState {
  mode: StorefrontMode;
  activeCategory: CatalogCategoryId;
  catalog: StorefrontCatalogItem[];
  pdp: Record<string, StorefrontPdpItem>;
  cart: StorefrontCartLine[];
  profile: StorefrontProfile;
  addresses: StorefrontAddress[];
  orders: StorefrontOrder[];
}

export interface StorefrontCatalogViewItem extends StorefrontCatalogItem {
  priorityRank: number;
  availabilityBadge: string;
}

export interface StorefrontPdpViewItem extends StorefrontPdpItem {
  priorityRank: number;
  availabilityBadge: string;
}

export interface StorefrontCartViewLine extends StorefrontCartLine {
  lineTotal: number;
}
