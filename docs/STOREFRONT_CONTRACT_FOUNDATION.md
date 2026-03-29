# Storefront Contract Foundation

Date: March 29, 2026

## Purpose

This document defines the minimum frontend contract assumptions for the next build steps in `clockwork-tyres-storefront`.

It is intended to keep product, UI, and domain work aligned while multiple people are working in parallel.

This is not the final API spec.

It is the contract foundation the team should build against now.

## Product Boundary

This repo owns the customer-facing Clockwork storefront experience.

It does not own:

- supplier admin workflows
- retailer admin workflows
- procurement backoffice
- CRM analytics
- super-admin controls

The storefront supports two modes only:

- `retail-store`
- `supplier-preview`

George confirmed that supplier preview reuses the same frontend, but cart and checkout are disabled.

## Source Of Truth For Mode Behavior

The reusable mode layer lives under:

- `src/app/core/storefront-mode`

That layer should remain the primary place that defines:

- whether a mode is read-only
- which capabilities are enabled
- which CTAs are visible
- which CTAs are disabled
- why a CTA is unavailable

Feature code should consume mode state. It should not duplicate mode rules locally.

## Mode Definitions

### `retail-store`

Use for the normal retailer-facing storefront.

Expected behavior:

- full catalog browsing
- vehicle and size search
- price visibility
- stock visibility
- quantity selection
- add to cart
- cart page
- checkout
- order submission
- account pages needed for storefront customers

This is the default storefront mode unless a supplier-preview context is explicitly set.

### `supplier-preview`

Use when a supplier is viewing their own storefront as a preview.

Expected behavior:

- same layout and navigation shell as retail-store
- same search and browsing experience
- same catalog and product detail rendering
- same pricing display unless product rules later require otherwise
- no cart entry points
- no add-to-cart
- no checkout
- no order placement
- no quantity-changing CTA

This mode is read-only by design.

The product list and product detail pages should still render as normal so suppliers can review how their storefront looks to customers.

## UI Rules By Capability

These are the intended UI effects of the two storefront modes.

| Capability | retail-store | supplier-preview | Notes |
| --- | --- | --- | --- |
| Pricing | enabled | enabled | Safe default until pricing rules change |
| Stock visibility | enabled | enabled | Preview should still show availability |
| Quantity selection | enabled | disabled | No quantity editing in preview |
| Cart | enabled | disabled | No cart icon behavior in preview mode |
| Checkout | enabled | disabled | No checkout route entry from preview mode |
| Order placement | enabled | disabled | Preview cannot submit orders |

## CTA Visibility Rules

The following CTA expectations should be treated as foundation rules:

| CTA | retail-store | supplier-preview |
| --- | --- | --- |
| Add to cart | visible and enabled | hidden |
| View cart | visible and enabled | hidden |
| Start checkout | visible and enabled | hidden |
| Submit checkout | visible and enabled | hidden |
| Change quantity | visible and enabled | hidden |

For supplier preview, prefer hiding transactional CTAs instead of showing disabled buttons unless a specific screen needs a visible explanation state later.

## Hidden Supplier Availability Rules

These rules are important because the old Clockwork frontend mixed retail and supplier logic too freely.

For the new storefront foundation, assume the following:

### 1. Retail storefront should not expose supplier-management concepts

Do not show:

- supplier tabs
- add supplier flows
- my suppliers pages
- procurement actions
- vendor approval states
- CRM-only relationship status

These belong in admin, not in this repo.

### 2. Retail storefront may show product availability, but not supplier-operational detail

The storefront can safely show:

- in stock
- low stock
- out of stock
- available to order
- one merged product card when the same tyre exists from own stock plus supplier-backed stock

The storefront should not assume it can show:

- which supplier owns the stock
- per-supplier breakdowns
- supplier internal warehouse lists
- wholesale procurement choices

If later business rules require supplier-origin detail, that must be added deliberately as a new contract, not inferred from legacy behavior.

### 3. Supplier preview shows the supplier's own storefront view only

Supplier preview should assume:

- catalog data is already filtered to the supplier scope by the domain layer or backend
- no cross-supplier comparison is shown
- no customer transaction is allowed

The frontend should not try to derive supplier ownership rules in the component layer.

### 4. Hidden means not actionable

If a mode disables cart or checkout:

- no visible CTA should navigate into that flow
- no component should emit transaction events
- no fake cart state should be created to simulate interaction

The mode layer is not cosmetic only. It is a behavior contract.

## Typed Contract Expectations

The next build steps should keep domain contracts typed and separate from presentation-only view models.

The exact file locations may evolve, but these shapes should exist in some form.

### Catalog List Contract

The catalog list contract should be enough to render product cards without opening product detail.

Recommended minimum shape:

```ts
export type CatalogProductCard = {
  id: string;
  slug: string;
  sku: string;
  brand: string;
  model: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  price: {
    currency: string;
    unitAmount: number;
    formattedUnitAmount?: string;
    setAmount?: number | null;
    formattedSetAmount?: string | null;
  };
  availability: {
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'available-to-order';
    label: string;
    quantityAvailable?: number | null;
  };
  tyre: {
    size: string;
    width?: number | null;
    aspectRatio?: number | null;
    rimSize?: number | null;
    loadIndex?: string | null;
    speedRating?: string | null;
    season?: string | null;
  };
};
```

Notes:

- keep price grouped, not spread as many top-level fields
- keep availability grouped so mode logic and rendering can use one source
- do not put cart-specific flags into the product card contract

### Product Detail Contract

The product detail contract should extend the catalog card idea, not replace it with a separate unstructured shape.

Recommended minimum shape:

```ts
export type ProductDetail = {
  id: string;
  slug: string;
  sku: string;
  brand: string;
  model: string;
  title: string;
  subtitle?: string;
  description?: string | null;
  imageUrls: string[];
  price: {
    currency: string;
    unitAmount: number;
    setAmount?: number | null;
    saleAmount?: number | null;
    pricingLevel?: 'retail' | 'wholesale_level_1' | 'wholesale_level_2' | 'wholesale_level_3' | null;
  };
  availability: {
    status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'available-to-order';
    label: string;
    quantityAvailable?: number | null;
  };
  tyre: {
    size: string;
    width?: number | null;
    aspectRatio?: number | null;
    rimSize?: number | null;
    loadIndex?: string | null;
    speedRating?: string | null;
    origin?: string | null;
    season?: string | null;
    runFlat?: boolean | null;
    warrantyLabel?: string | null;
  };
  specifications: Array<{
    label: string;
    value: string;
  }>;
  compatibleVehicles?: Array<{
    label: string;
  }>;
  relatedOptions?: Array<{
    sku: string;
    slug: string;
    size: string;
    availabilityStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'available-to-order';
  }>;
};
```

Notes:

- keep detail data product-centric
- avoid embedding UI tabs into the domain model
- UI-specific tab grouping should be derived in the feature layer
- preserve hidden source options outside the customer-facing contract so retailer admin can choose supplier manually later

### Cart Contract

The cart contract should model a real transaction container for `retail-store` only.

Recommended minimum shape:

```ts
export type CartLine = {
  lineId: string;
  productId: string;
  sku: string;
  slug: string;
  brand: string;
  model: string;
  title: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  availabilityStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'available-to-order';
};

export type CartSummary = {
  currency: string;
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
};

export type StorefrontCart = {
  id: string;
  lines: CartLine[];
  summary: CartSummary;
};
```

Notes:

- do not create cart contracts that depend on supplier-preview behavior
- supplier-preview should simply never activate cart behavior
- line contracts should remain retail-transaction focused

### Account Contract

The storefront account area should stay intentionally small.

Recommended minimum shape:

```ts
export type StorefrontAccountProfile = {
  id: string;
  businessName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
};

export type StorefrontAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
};

export type StorefrontOrderSummary = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: string;
  currency: string;
  total: number;
};
```

Notes:

- do not import CRM user-management assumptions into storefront account contracts
- keep account contracts customer-facing and minimal
- supplier admin and retailer admin are not storefront account concerns

## Contract Boundaries Between Layers

To reduce rework, the team should follow these boundaries:

### Domain layer responsibilities

- fetch catalog data
- fetch product detail data
- fetch cart data
- fetch account data
- normalize API responses into typed contracts
- scope data for supplier-preview when required

### Storefront mode layer responsibilities

- define read-only versus transactional mode
- define CTA visibility and disabled reasons
- answer capability checks for feature components

### Feature component responsibilities

- render based on typed contracts
- consume mode state
- derive presentation details from domain data
- avoid hardcoding business rules already captured in mode/config/domain layers

## Migration Notes From Legacy Clockwork Frontend

The legacy frontend remains the visual source of truth, but not the contract source of truth.

Legacy repo:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular`

### Safe To Migrate From Legacy

- layout structure
- product card composition
- product detail visual hierarchy
- search modal layout
- cart page layout
- account page shell layout
- typography, spacing, image treatment, and responsive behavior

### Do Not Migrate Directly

- `localStorage`-driven business logic
- jQuery modal and DOM mutation behavior
- old god-service API assumptions
- old supplier pages and add-supplier flows
- mixed B2B and storefront route behavior
- backend-specific response shapes from the Angular 11 app

### Legacy Areas That Need Deliberate Reinterpretation

#### Product list and detail

Legacy pages often combined:

- retail-style browsing
- supplier-stock assumptions
- old B2B interactions

In the new app:

- keep the visual layout
- rebuild the data contract cleanly
- let mode determine whether transactional CTAs exist
- keep source aggregation out of presentational components

#### Cart and checkout

Legacy cart and checkout assumed a single interactive storefront experience.

In the new app:

- these flows belong only to `retail-store`
- supplier-preview must not partially emulate them

#### Account

Legacy account screens mixed several old business concepts.

In the new app:

- keep only customer-facing storefront account basics
- do not pull supplier relationship flows back into the storefront

## Immediate Next Build Steps

The next engineering slices should follow this order:

1. Finalize typed catalog and product-detail contracts in the domain/data-access layer.
2. Connect feature components to `src/app/core/storefront-mode` instead of local CTA rules.
3. Add merged product aggregation support for own stock plus hidden supplier-backed stock.
4. Build a small adapter from backend/domain responses into the recommended contract shapes.
5. Gate cart and checkout entry points entirely through storefront mode checks.
6. Keep supplier-preview data filtering and supplier-source option handling outside presentation components.

## Working Assumptions Until Product Rules Change

- `retail-store` is the default mode
- `supplier-preview` is read-only
- supplier-preview still shows prices and availability
- transactional CTAs are hidden in supplier-preview
- storefront account scope stays minimal
- supplier-management flows remain outside this repo
- the same tyre should render as one merged storefront entry even when multiple hidden sources exist

If any of these assumptions change, update this document and the storefront mode config together.
