# Legacy Clockwork UI Reuse Audit

Date: March 29, 2026

## Purpose

George wants the new storefront to match the current Clockwork frontend design as closely as possible.

That means the legacy repo at `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular` is the visual source of truth for storefront UI.

It is not the technical source of truth.

## Decision

Use the legacy Clockwork frontend for:

- HTML structure
- SCSS and layout rules
- fonts
- icons
- images
- spacing, sizing, and responsive behavior

Do not carry forward the legacy runtime stack:

- Angular 11 app architecture
- jQuery-driven UI behavior
- Bootstrap JS collapse and modal behavior
- old API service contract
- pqGrid admin integration
- duplicated global library loading

## Reuse Strategy

### 1. Port Visuals Exactly

These areas should be ported into the new Angular 21 storefront with the goal of pixel-perfect visual parity.

#### Header and Top Search Bar

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\includes\header\header.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\includes\header\header.component.scss`

Plan:

- preserve the two-row structure
- preserve logo placement
- preserve search-by-vehicle and search-by-size entry points
- preserve search input proportions, radius, and spacing
- preserve cart and account icon placement

Rebuild:

- routing behavior
- dropdown behavior
- modal triggers
- account state handling
- search state handling

#### Login Screen

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\login\login.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\login\login.component.scss`

Plan:

- preserve split-screen composition
- preserve logo, feature list, and right-panel form box
- preserve dark background and visual balance

Rebuild:

- auth flow
- signup flow
- validation and API integration

#### Search By Vehicle Modal

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-vehicle\search-by-vehicle.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-vehicle\search-by-vehicle.component.css`

Plan:

- preserve modal layout
- preserve multi-step select sequence
- preserve button sizing and spacing

Rebuild:

- fitment data loading
- form state
- navigation to results
- modal behavior without Bootstrap JS

#### Search By Size Modal

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-size\search-by-size.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-size\search-by-size.component.css`

Plan:

- preserve modal structure
- preserve front/rear size layout
- preserve field grouping and CTA placement

Rebuild:

- form rules
- validation
- data integration
- modal behavior without Bootstrap JS

#### Catalog Listing Shell

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-listing\wheels-listing.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-listing\wheels-listing.component.scss`

Plan:

- preserve overall desktop layout
- preserve filter rail position
- preserve sort and view toolbar rhythm
- preserve list/grid switching affordance

Rebuild:

- routing
- query param sync
- loading states
- API response mapping

#### Product Item / Result Card

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheel-single\wheel-single.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheel-single\wheel-single.component.scss`

Plan:

- preserve product image sizing
- preserve typography hierarchy
- preserve stock and CTA alignment
- preserve spacing of meta fields

Rebuild:

- pricing logic
- stock logic
- cart interactions
- inventory modal integration

#### Product Detail Page

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-detail\wheels-detail.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-detail\wheels-detail.component.scss`

Plan:

- preserve image gallery composition
- preserve right-side product summary block
- preserve specification section structure
- preserve add-to-cart area proportions

Rebuild:

- gallery behavior
- inventory lookup
- option selection
- cart and checkout flow

#### Filters

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheel-filters\wheel-filters.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheel-filters\wheel-filters.component.scss`

Plan:

- preserve accordion look
- preserve checkbox/radio treatment
- preserve mobile filter drawer pattern

Rebuild:

- filter state model
- URL syncing
- accessibility
- mobile drawer behavior without jQuery/Bootstrap JS

#### Dashboard / Account Shell

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\dashboard\dashboard.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\dashboard\dashboard.component.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\my-accounts\my-accounts.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\my-accounts\my-accounts.component.scss`

Plan:

- preserve useful storefront account shell patterns
- preserve tab rhythm where still relevant

Rebuild:

- exact routes
- account data model
- order history integration

Note:

- this area should be reused selectively because George's new admin direction now comes mainly from the CRM mockups

#### Cart and Checkout

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\cart\shopping-cart\shopping-cart.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\cart\shopping-cart\shopping-cart.component.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\cart\checkout\checkout.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\cart\checkout\checkout.component.scss`

Plan:

- preserve visual layout patterns where they still match the target store
- preserve table rhythm and summary layout only where still relevant

Rebuild:

- cart state
- order placement
- payment flow
- shipping and tax rules

## Assets To Copy Into The New Storefront

These should be copied into the new repo and used as the base visual asset pack.

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\fonts`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\img`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\style.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\owl.carousel.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\styles\_variables.scss`

## Technical Constraints Found In The Legacy Frontend

The current app is visually useful, but technically not safe to carry forward directly.

### Legacy Runtime Issues

- Angular 11 application
- module-heavy structure
- Bootstrap 4 JS behavior
- jQuery dependency
- pqGrid dependency
- duplicate script and stylesheet loading between `angular.json` and `src/index.html`
- oversized global stylesheet
- many `!important` overrides
- API service tightly coupled to the old backend

Key files:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\angular.json`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\index.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\app.module.ts`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\services\api.service.ts`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\js\script.js`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\my-accounts\my-products\pqgrid.component.ts`

## Final Direction

Yes, we should use the Clockwork frontend repo as the canonical design source for the new storefront.

But we should use it like this:

- copy the visual layer
- port the templates and styles into Angular 21 standalone components
- preserve the visual design as closely as possible
- rebuild behavior, state, and integrations cleanly against the new platform APIs

We should not:

- upgrade this Angular 11 app in place
- carry its plugin stack forward as-is
- bind the new storefront to the old API contract

## Recommended Build Rule

For storefront work, every screen should answer two questions:

1. Is the visual target the current Clockwork UI?
2. If yes, which legacy HTML, SCSS, and assets are the reference source?

That gives us the best chance of staying pixel-perfect while still building a clean, scalable modern frontend.
