export interface StorefrontCatalogApiAvailability {
  origin: 'own' | 'supplier';
  label: string;
  quantity: number;
  show_quantity: boolean;
  supplier_count: number;
}

export interface StorefrontCatalogApiModeAvailability {
  retail_store: boolean;
  supplier_preview: boolean;
}

export interface StorefrontCatalogApiItem {
  group_id: number;
  sku: string;
  slug: string;
  brand: string;
  model: string;
  subtitle: string;
  category: string;
  size: string;
  price: number;
  compare_at_price?: number | null;
  image: string | null;
  availability: StorefrontCatalogApiAvailability;
  mode_availability: StorefrontCatalogApiModeAvailability;
  featured?: boolean;
}

export interface StorefrontCatalogApiSpecificationRow {
  label: string;
  value: string;
}

export interface StorefrontCatalogApiOption {
  sku: string;
  slug: string;
  size: string;
  load_index: string;
  speed_rating: string;
  season: string;
  availability: StorefrontCatalogApiAvailability;
  mode_availability: StorefrontCatalogApiModeAvailability;
}

export interface StorefrontCatalogApiProduct extends StorefrontCatalogApiItem {
  description: string;
  gallery: string[];
  fits: string[];
  specifications: StorefrontCatalogApiSpecificationRow[];
  options: StorefrontCatalogApiOption[];
  related_slugs: string[];
}

export interface StorefrontCatalogApiListResponse {
  status: boolean;
  message?: string | null;
  data: {
    items: StorefrontCatalogApiItem[];
    meta: {
      mode: string;
      category: string;
      item_count: number;
      account_slug: string | null;
    };
  } | null;
}

export interface StorefrontCatalogApiProductResponse {
  status: boolean;
  message?: string | null;
  data: {
    product: StorefrontCatalogApiProduct;
  } | null;
}
