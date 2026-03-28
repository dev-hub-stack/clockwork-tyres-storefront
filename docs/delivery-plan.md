# Delivery Plan

## Goal

Deliver a production-ready retail storefront on Angular 21 that integrates with the CRM backend and replaces the legacy Clockwork storefront for retail-facing use cases.

## Work That Can Start Immediately

These items do not require further product clarification:

- Scaffold Angular 21 app and baseline tooling
- Establish routing, app shell, and folder structure
- Set up core HTTP, auth, and session infrastructure
- Define storefront domain models and repository interfaces
- Build design tokens and layout primitives from the approved mockups
- Build fitment search, catalog list, and product detail foundations
- Build cart and checkout skeletons against mock or adapter interfaces
- Set up testing, linting, formatting, and CI basics

## Work Blocked By Product Clarifications

These items need confirmed answers before implementation is finalized:

- Is the storefront public, login-first, or mixed by route
- Exact pricing visibility rules for retailers
- Whether one cart may contain items from multiple suppliers
- How multi-supplier checkout is converted into backend orders
- Whether supplier read-only store views are public or account-scoped
- What customer account features stay in storefront versus move to CRM
- Final URL strategy and SEO expectations

## Delivery Phases

### Phase 0: Foundation

Output:

- Angular 21 workspace
- application config and routing baseline
- CI, lint, format, and test setup
- architecture-approved folder structure

Exit criteria:

- app runs locally
- docs reflect the scaffolded structure
- core engineering standards are in place

### Phase 1: Core Infrastructure

Output:

- config and environment model
- auth/session services
- HTTP client setup and interceptors
- error handling and loading conventions
- route guards where needed

Exit criteria:

- frontend can call mock or real backend adapters through repositories
- no direct `localStorage` reads in feature components

### Phase 2: Search And Catalog

Output:

- home page shell
- vehicle search
- size search
- product listing page
- filter and sorting behavior
- product detail page

Legacy reference:

- `../dealer-portal-Angular/src/app/pages/home/search-form`
- `../dealer-portal-Angular/src/app/pages/wheels/wheels-listing`
- `../dealer-portal-Angular/src/app/pages/wheels/wheels-detail`

Exit criteria:

- major browse and discovery journeys work end to end
- route state and query params are stable

### Phase 3: Cart And Checkout

Output:

- cart page
- quantity and item updates
- checkout form
- shipping option handling
- order submission integration

Legacy reference:

- `../dealer-portal-Angular/src/app/cart/shopping-cart`
- `../dealer-portal-Angular/src/app/cart/checkout`

Exit criteria:

- add-to-cart to order-submission flow works against target backend contract

### Phase 4: Customer Account

Output:

- login
- signup if still required in storefront
- address management if confirmed
- order history if confirmed

Exit criteria:

- authenticated flows are stable
- account scope matches agreed product scope

### Phase 5: Hardening

Output:

- SSR or hybrid rendering for selected public routes
- analytics hooks
- accessibility pass
- performance pass
- QA stabilization

Exit criteria:

- storefront meets launch readiness targets for performance, reliability, and UX

## Reuse vs Rewrite Delivery Rule

Use the legacy app for flow validation and contract discovery only. New implementation should be written in the new architecture unless there is a small, isolated utility that can be ported cleanly.

Default rule:

- Reuse behavior and domain knowledge
- Rewrite infrastructure and components

## Initial Risks

- Backend contracts may still reflect legacy assumptions
- Multi-supplier commerce rules may remain unclear too long
- Mockup coverage may be incomplete for edge flows
- Checkout behavior can drift if backend ownership is not fixed early

## Recommended Sequence

1. Approve docs and repo scope
2. Scaffold Angular 21 app
3. Lock route map and domain boundaries
4. Build search and catalog
5. Build cart and checkout
6. Connect to CRM APIs and harden
