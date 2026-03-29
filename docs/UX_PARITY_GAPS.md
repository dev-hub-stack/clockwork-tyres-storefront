# Legacy Clockwork UX Parity Gaps

Date: March 29, 2026

Purpose: track the biggest remaining gaps between the legacy Clockwork storefront and the Angular 21 storefront, ordered by pixel-perfect alignment priority.

This is a storefront-only gap list. It focuses on the screens George will notice first:

- home
- search
- listing
- PDP
- cart
- account

## Priority 1: Header, Home, And Search Entry

### 1. Legacy header composition is not fully matched

- Type: `visual` + `behavioral`
- Legacy reference: [header.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/includes/header/header.component.html)
- Current target: [clockwork-header.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/shared/ui/clockwork-header/clockwork-header.component.html)

Gap:

- the legacy two-row header rhythm and exact spacing still need pixel-level alignment
- modal trigger placement and icon balance need closer matching
- home/search entry interactions still need final parity checks

### 2. Home/search landing composition is still simplified

- Type: `visual` + `behavioral`
- Legacy reference: [feature.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/feature/feature.component.html) and [new-home.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/new-home/new-home.component.html)
- Current target: storefront shell and search modals in `clockwork-tyres-storefront`

Gap:

- the home page hero/content rhythm is not yet fully recreated
- legacy entry points for vehicle and size search need exact spacing and prominence matching
- banner, trust-copy, and first-screen hierarchy still need a pixel pass

## Priority 2: Listing And Filters

### 3. Listing toolbar and filter rail are not yet pixel-perfect

- Type: `visual` + `behavioral`
- Legacy reference: [wheels-listing.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheels-listing/wheels-listing.component.html)
- Current target: [catalog-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/catalog-page.component.html)

Gap:

- the toolbar density, sort/view controls, and filter rail spacing still differ from legacy
- filter drawer behavior and mobile interaction need final parity checks
- list/grid affordance still needs the same feel as legacy Clockwork

### 4. Product card density and metadata layout still differ

- Type: `visual` + `data-contract`
- Legacy reference: [wheel-single.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheel-single/wheel-single.component.html)
- Current target: [catalog-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/catalog-page.component.html)

Gap:

- spacing between image, brand, subtitle, size, stock, and CTA still needs a tighter legacy match
- the new tyre card contract is cleaner, but some legacy wheel-era metadata placement still has to be re-expressed visually
- stock and CTA alignment needs another pixel pass on desktop and mobile

### 5. Search-by-size and search-by-vehicle flows need final contract parity

- Type: `behavioral` + `data-contract`
- Legacy references:
  - [search-by-size.component.ts](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/shared/components/search-by-size/search-by-size.component.ts)
  - [search-by-vehicle.component.ts](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/shared/components/search-by-vehicle/search-by-vehicle.component.ts)
- Current target: storefront search modals in `clockwork-tyres-storefront`

Gap:

- the new app preserves the journey, but the exact query-param and field mapping still needs final category-aware parity work
- vehicle search and size search should feel identical in flow timing, transitions, and result handoff
- the search experience still needs a final review for loading states and empty states

## Priority 3: PDP

### 6. Product detail gallery and spec block need the last visual pass

- Type: `visual` + `behavioral`
- Legacy reference: [wheels-detail.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheels-detail/wheels-detail.component.html)
- Current target: [product-detail-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/product-detail-page.component.html)

Gap:

- the image gallery layout, thumbnail rhythm, and summary block proportions still need refinement
- spec and fitment sections are structurally correct but not yet fully pixel-aligned
- the "more size & options" table still needs a closer legacy-style spacing pass

### 7. PDP option and fitment behavior still needs refinement

- Type: `behavioral` + `data-contract`
- Legacy reference: [wheels-detail.component.ts](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheels-detail/wheels-detail.component.ts)
- Current target: [product-detail-page.component.ts](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/product-detail-page.component.ts)

Gap:

- option selection, fitment messaging, and related options still need final behavior parity checks
- the tyre contract is intentionally different, but the interaction pattern should still feel like Clockwork
- inventory-driven CTA behavior should be reviewed against the legacy feel

## Priority 4: Cart And Account

### 8. Cart summary and checkout layout still need the final legacy feel

- Type: `visual` + `behavioral`
- Legacy references:
  - [shopping-cart.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/cart/shopping-cart/shopping-cart.component.html)
  - [checkout.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/cart/checkout/checkout.component.html)
- Current targets:
  - [cart-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/cart/cart-page.component.html)
  - [checkout-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/cart/checkout-page.component.html)

Gap:

- table rhythm, totals placement, and action button positioning still need visual matching
- shipping/billing form sections should be checked against the legacy nesting and spacing
- empty states and preview-only states need one more alignment pass

### 9. Account shell and order/address pages are functional but not yet identical

- Type: `visual` + `data-contract`
- Legacy references:
  - [dashboard.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/dashboard/dashboard.component.html)
  - [my-accounts.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/my-accounts/my-accounts.component.html)
- Current targets:
  - [account-shell.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/account-shell.component.html)
  - [addresses-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/addresses-page.component.html)
  - [orders-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/orders-page.component.html)

Gap:

- the account shell is cleaner than legacy, but the tab rhythm and content density still need a final visual comparison
- address and order data are now shared and typed, but the presentation should be checked against the legacy feel
- some legacy account concepts are intentionally not being copied, so parity here is visual rather than structural

## Data-Contract Gaps That Still Matter Most

These are the biggest contract mismatches still worth tracking for pixel-perfect work:

- the legacy wheel contract is still the reference for spacing and density, even though the new tyre contract is cleaner
- search results still depend on category-specific fields and fitment mapping
- merged own-stock plus supplier-stock presentation needs backend/contract clarity before the final visual pass
- catalog cards and PDP specs still need final category adapters so the UI never has to infer missing meaning

## What Is Already Good Enough For Now

These areas are close enough to continue building without waiting for pixel perfection:

- overall storefront shell
- modern Angular 21 structure
- supplier-preview mode gating
- shared data layer scaffolding
- account data wiring

## Next Parity Pass

The next visual review should be done in this order:

1. header and home/search entry
2. listing toolbar, filter rail, and product card
3. PDP gallery and spec block
4. cart summary and checkout layout
5. account shell, orders, and addresses

If we keep the next pass in this order, we will get the fastest route to pixel-perfect alignment with the least rework.
