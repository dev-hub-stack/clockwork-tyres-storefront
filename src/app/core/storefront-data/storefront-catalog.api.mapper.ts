import {
  StorefrontCatalogApiAvailability,
  StorefrontCatalogApiItem,
  StorefrontCatalogApiModeAvailability,
  StorefrontCatalogApiProduct,
  StorefrontCatalogApiSpecificationRow
} from './storefront-catalog.api.types';
import {
  StorefrontAvailability,
  StorefrontCatalogItem,
  StorefrontModeAvailability,
  StorefrontPdpItem,
  StorefrontProductOption,
  StorefrontSpecificationRow
} from './storefront-data.models';

const DEFAULT_TYRE_IMAGE = '/assets/img/tire-go.jpg';

function normalizeCategory(category: string): 'tyres' | 'wheels' {
  return category === 'wheels' ? 'wheels' : 'tyres';
}

function mapModeAvailability(
  availability: StorefrontCatalogApiModeAvailability
): StorefrontModeAvailability {
  return {
    retailStore: availability.retail_store,
    supplierPreview: availability.supplier_preview
  };
}

function mapAvailability(availability: StorefrontCatalogApiAvailability): StorefrontAvailability {
  return {
    origin: availability.origin,
    label: availability.label,
    quantity: availability.quantity,
    showQuantity: availability.show_quantity,
    supplierCount: availability.supplier_count
  };
}

function mapImage(image: string | null): string {
  if (!image || image.trim() === '') {
    return DEFAULT_TYRE_IMAGE;
  }

  return image;
}

export function mapCatalogApiItem(apiItem: StorefrontCatalogApiItem): StorefrontCatalogItem {
  return {
    sku: apiItem.sku,
    slug: apiItem.slug,
    brand: apiItem.brand,
    model: apiItem.model,
    subtitle: apiItem.subtitle,
    category: normalizeCategory(apiItem.category),
    size: apiItem.size,
    price: apiItem.price,
    compareAtPrice: apiItem.compare_at_price ?? undefined,
    image: mapImage(apiItem.image),
    availability: mapAvailability(apiItem.availability),
    modeAvailability: mapModeAvailability(apiItem.mode_availability),
    featured: Boolean(apiItem.featured)
  };
}

function mapSpecificationRow(
  row: StorefrontCatalogApiSpecificationRow
): StorefrontSpecificationRow {
  return {
    label: row.label,
    value: row.value
  };
}

function mapProductOption(option: StorefrontCatalogApiProduct['options'][number]): StorefrontProductOption {
  return {
    sku: option.sku,
    slug: option.slug,
    size: option.size,
    loadIndex: option.load_index,
    speedRating: option.speed_rating,
    season: option.season,
    availability: mapAvailability(option.availability),
    modeAvailability: mapModeAvailability(option.mode_availability)
  };
}

export function mapCatalogApiProduct(apiProduct: StorefrontCatalogApiProduct): StorefrontPdpItem {
  const catalogItem = mapCatalogApiItem(apiProduct);
  const gallery = apiProduct.gallery.length
    ? apiProduct.gallery.map(mapImage)
    : [catalogItem.image];

  return {
    ...catalogItem,
    description: apiProduct.description,
    gallery,
    fits: apiProduct.fits,
    specifications: apiProduct.specifications.map(mapSpecificationRow),
    options: apiProduct.options.map(mapProductOption),
    relatedSkus: apiProduct.related_slugs
  };
}
