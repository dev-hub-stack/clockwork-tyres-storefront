import { CatalogCategoryId } from '../catalog-categories';

export type StorefrontMode = 'retail-store' | 'supplier-preview';

export type StockOrigin = 'own' | 'supplier';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export type StorefrontDataLoadStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

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

export type StorefrontCartLineInput = Omit<StorefrontCartLine, 'id'>;

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

export interface StorefrontCheckoutAddress {
  businessName: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  phone: string;
}

export interface StorefrontCheckoutPayload {
  billing: StorefrontCheckoutAddress;
  shipping: StorefrontCheckoutAddress;
  purchaseOrderNo: string | null;
  orderNotes: string | null;
  deliveryOption: 'Pick up from warehouse' | 'Delivery';
  items: Array<{
    sku: string;
    slug: string;
    title: string;
    size: string;
    quantity: number;
    unitPrice: number;
    origin: StockOrigin;
    availabilityLabel: string;
  }>;
}

export interface StorefrontCheckoutResult {
  id: number;
  orderNumber: string;
  status: OrderStatus;
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
  catalogStatus: StorefrontDataLoadStatus;
  catalogError: string | null;
  workspaceStatus: StorefrontDataLoadStatus;
  workspaceError: string | null;
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

export const createEmptyStorefrontProfile = (): StorefrontProfile => ({
  businessName: '',
  address: '',
  email: '',
  phone: '',
  country: '',
  licenseNumber: '',
  expiry: '',
  website: '',
  instagram: '',
  contactName: '',
  accountType: 'retailer',
  wholesaleEnabled: false,
  retailEnabled: false,
  subscription: ''
});

export const createEmptyStorefrontDataState = (): StorefrontDataState => ({
  mode: 'retail-store',
  activeCategory: 'tyres',
  catalog: [],
  pdp: {},
  cart: [],
  profile: createEmptyStorefrontProfile(),
  addresses: [],
  orders: [],
  catalogStatus: 'idle',
  catalogError: null,
  workspaceStatus: 'idle',
  workspaceError: null
});
