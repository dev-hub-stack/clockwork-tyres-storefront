# clockwork-tyres-storefront

Retail-facing Clockwork storefront for tyres and related products.

This repository is the new frontend for George's V3 storefront vision. It is intentionally separate from the legacy Angular application and from the CRM/admin codebase. The goal is to build a clean, modern Angular 21 storefront that integrates with the new CRM backend without carrying forward the legacy frontend architecture.

## Scope

- Public and retailer-facing storefront experience
- Vehicle and size search
- Product listing and product detail pages
- Cart and checkout
- Customer authentication and account basics
- Read-only supplier store views if product requirements confirm that feature

## Out Of Scope

- Supplier admin
- Retailer backoffice/admin
- Super-admin
- Inventory grid management
- CRM reporting screens

Those areas belong in the CRM and related admin applications, not in this storefront repository.

## Source Systems

- Legacy storefront reference: `../dealer-portal-Angular`
- New CRM/backend target: `../reporting-crm`
- Legacy backend contract reference: `../tunerstop-vendor`

## Reuse From Legacy App

We are reusing the business understanding and selected UX flows from the legacy storefront, not the legacy architecture.

- Fitment search flow from `../dealer-portal-Angular/src/app/pages/home/search-form`
- Catalog listing and filtering behavior from `../dealer-portal-Angular/src/app/pages/wheels/wheels-listing`
- Product detail flow from `../dealer-portal-Angular/src/app/pages/wheels/wheels-detail`
- Cart and checkout domain rules from `../dealer-portal-Angular/src/app/cart`
- SEO/meta conventions and selected helper logic from `../dealer-portal-Angular/src/app/shared/services/helper.service.ts`

## Rewrite Areas

The following are intentionally being rebuilt:

- App bootstrap and routing
- State management
- HTTP client and backend integration layer
- Auth and session handling
- Cart and checkout implementation details
- Header, shell, and layout components
- All jQuery, global script, and direct DOM behavior
- All `pqgrid`-based account/admin screens
- Supplier discovery and dealer admin flows that now belong in CRM

## Target Stack

- Angular 21
- Standalone components and application config
- Signals for view state
- Typed reactive forms
- `provideHttpClient` with functional interceptors
- SSR or hybrid rendering for public catalog routes
- Modern route-level lazy loading
- Testing at unit, component, route, and end-to-end levels

## Architecture Summary

The storefront will use a domain-oriented structure:

- `core/` for app-wide infrastructure such as config, auth, session, and HTTP
- `shared/` for reusable UI, models, and utilities
- `domains/fitment/` for vehicle and size search
- `domains/catalog/` for listing, filters, and product detail
- `domains/cart/` for cart and checkout
- `domains/account/` for login, addresses, and orders

Feature components should talk to facades and repositories, not directly to `HttpClient`, `localStorage`, or environment globals.

## Documents

- [Architecture](docs/architecture.md)
- [Delivery Plan](docs/delivery-plan.md)

## Current Status

This repository starts as a docs-first repo. The Angular application scaffold, CI, and implementation work will be added after the initial architecture and delivery approach are agreed.

## Initial Build Priorities

1. Scaffold Angular 21 application and baseline tooling
2. Establish app shell, routing, and core infrastructure
3. Implement fitment search and catalog browsing
4. Implement product detail, cart, and checkout
5. Integrate with CRM-backed storefront APIs

