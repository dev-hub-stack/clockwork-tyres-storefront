# Legacy Clockwork UX Parity Gaps

Date: March 29, 2026

Purpose: a practical next-pass parity map for the new Angular 21 storefront against the legacy Clockwork storefront.

Scope: storefront only. This covers the screens George will notice first and the legacy routes/behaviors we still need to preserve or consciously defer.

## Current Storefront Coverage

The new storefront already has the right screen family in place:

- home shell
- header
- search by size modal
- search by vehicle modal
- listing/catalog
- product detail
- cart
- checkout
- login
- account profile, addresses, and orders

The main remaining work is visual parity, interaction rhythm, and a few legacy route behaviors.

## Next-Pass Parity Map

| Area | Legacy reference | Current target | Parity status | Next pass focus |
| --- | --- | --- | --- | --- |
| Home | [feature.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/feature/feature.component.html), [new-home.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/new-home/new-home.component.html) | [home-shell.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/home/home-shell.component.html) | Partial | Match first-screen hierarchy, hero rhythm, trust copy, CTA spacing, and the legacy sense of density on desktop and mobile. |
| Header | [header.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/includes/header/header.component.html) | [clockwork-header.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/shared/ui/clockwork-header/clockwork-header.component.html) | Partial | Lock the two-row rhythm, icon balance, modal trigger placement, and spacing around search/account/cart actions. |
| Search by size modal | [search-by-size.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/shared/components/search-by-size/search-by-size.component.html) | [search-by-size-modal.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/shared/ui/search-by-size-modal/search-by-size-modal.component.html) | Close | Keep the legacy modal shell and section rhythm, while preserving category-aware field rendering and the rear-size toggle. |
| Search by vehicle modal | [search-by-vehicle.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/shared/components/search-by-vehicle/search-by-vehicle.component.html) | [search-by-vehicle-modal.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/shared/ui/search-by-vehicle-modal/search-by-vehicle-modal.component.html) | Close | Match the select/input spacing, dropdown chrome, footnote tone, and the exact handoff feel into listing results. |
| Listing / catalog | [wheels-listing.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheels-listing/wheels-listing.component.html) | [catalog-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/catalog-page.component.html) | Partial | Tighten toolbar density, filter rail spacing, mobile filter behavior, and the result grid rhythm. |
| Product card | [wheel-single.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheel-single/wheel-single.component.html) | [catalog-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/catalog-page.component.html) | Partial | Match image crop, text stack, price/stock placement, and CTA alignment without reintroducing wheel-only assumptions. |
| PDP | [wheels-detail.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/wheels/wheels-detail/wheels-detail.component.html) | [product-detail-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/catalog/product-detail-page.component.html) | Partial | Refine gallery proportions, thumbnail cadence, spec table spacing, and the "more size & options" block feel. |
| Cart | [shopping-cart.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/cart/shopping-cart/shopping-cart.component.html) | [cart-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/cart/cart-page.component.html) | Partial | Match table density, totals placement, action button placement, and the legacy empty-state feel. |
| Checkout | [checkout.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/cart/checkout/checkout.component.html) | [checkout-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/cart/checkout-page.component.html) | Partial | Keep the legacy checkout grouping and spacing, but preserve launch rules: no payment capture yet. |
| Login | [login.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/login/login.component.html) | [login-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/auth/login-page.component.html) | Partial | Match the visual framing and form rhythm; keep the new auth flow clean and brand-consistent. |
| Account | [dashboard.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/pages/dashboard/dashboard.component.html), [my-accounts.component.html](C:/Users/Dell/Documents/Gerorge/dealer-portal-Angular/src/app/my-accounts/my-accounts.component.html) | [account-shell.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/account-shell.component.html), [profile-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/profile-page.component.html), [addresses-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/addresses-page.component.html), [orders-page.component.html](C:/Users/Dell/Documents/Gerorge/clockwork-tyres-storefront/src/app/features/account/orders-page.component.html) | Partial | Match tab rhythm, content density, and the old account-shell feel without copying admin-only legacy pages into the storefront. |

## What Is Already Close Enough

These areas are good enough to keep building while the parity work continues:

- Angular 21 app structure and routing
- category-aware fitment foundation
- supplier-preview mode gating
- overall storefront shell and navigation flow

## Notable Legacy Routes And Behaviors Still To Keep In Mind

The legacy app contains more routes and behaviors than the new storefront exposes today. Some should be preserved as compatibility redirects; others should remain in the CRM/admin side instead of the public storefront.

### Keep As Compatibility Or Light Redirects

- `serchvehicle` should keep redirecting to `search-by-vehicle`
- `wheelbrand`, `wheelbrand/:brand`, and `wheelbrand/:brand/:product` are legacy SEO routes that may need redirects or category-aware equivalents later
- `search-by-size` and `search-by-vehicle` should continue to hand off into the catalog/listing flow in the same way the legacy app did
- legacy product detail deep links should stay resolvable to the new PDP if the SKU/route contract changes later

### Park For Later Or Move To CRM/Admin

- `vendor-login`
- `reset-password`
- `process-payment`
- `order-confirm`
- `thank-you`
- `cancel-order`
- `installments`
- `downloads`
- `tutorials`
- `contact-us`
- `landing-page`
- footer/legal pages such as privacy, terms, delivery, and returns
- old account subpages such as invoices, integration, plans, downloads, wishlist, and inventory-related views

### Legacy Home/Promo Routes Worth Remembering

- `feature`
- `new-home`
- `new-products`
- `alloy-wheels`
- `clearnce-wheels`
- `suppliers`
- `search`

These are useful as reference for content structure and SEO patterns, even if they are not part of the first storefront release.

## Next Practical Parity Pass

If we want the fastest route to George-level parity, the next review order should be:

1. header and home/search entry
2. search modals
3. listing and product card
4. PDP
5. cart and checkout
6. login and account shell

That order gives us the highest visual impact first while keeping the new category-aware foundation intact.
