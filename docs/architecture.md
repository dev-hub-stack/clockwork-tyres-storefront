# Architecture

## Purpose

`clockwork-tyres-storefront` is the retail-facing storefront for the Clockwork tyres platform. It is a dedicated frontend application and should remain separate from supplier admin, retailer admin, and super-admin concerns.

## Architectural Goals

- Build on Angular 21 and current Angular patterns
- Keep the storefront independent from CRM UI concerns
- Integrate cleanly with CRM-backed APIs
- Preserve useful legacy business behavior without carrying over legacy technical debt
- Keep the codebase maintainable for future expansion

## Key Decisions

### 1. New App, Not Legacy In-Place Upgrade

The legacy app in `../dealer-portal-Angular` is a useful reference, but not a viable base for the new storefront.

Reasons:

- Angular 11 monolith
- oversized `pages` module and mixed concerns
- heavy `localStorage` coupling
- single god-service for backend access
- jQuery and direct DOM manipulation
- `pqgrid` admin screens mixed into the frontend
- leftover unrelated code paths such as `src/app/api.service.ts` and old guards

### 2. Storefront-Only Boundary

This repo owns:

- home and landing pages
- vehicle and size search
- catalog browsing
- product detail pages
- cart and checkout
- customer account basics

This repo does not own:

- supplier management
- retailer procurement admin
- product/inventory backoffice
- CRM analytics and reporting

### 3. Domain-Oriented Frontend Structure

Target structure:

```text
src/app/
  app.config.ts
  app.routes.ts
  core/
    auth/
    config/
    http/
    layout/
    session/
  shared/
    models/
    ui/
    util/
  domains/
    fitment/
      application/
      data-access/
      feature-size-search/
      feature-vehicle-search/
    catalog/
      application/
      data-access/
      feature-list/
      feature-detail/
    cart/
      application/
      data-access/
      feature-cart/
      feature-checkout/
    account/
      application/
      data-access/
      feature-auth/
      feature-addresses/
      feature-orders/
```

## Angular 21 Standards

- Standalone components by default
- `bootstrapApplication` and app-level config
- `provideRouter` with route-level lazy loading
- `provideHttpClient` with functional interceptors
- signals for local and facade state
- typed reactive forms
- `@if`, `@for`, and `@switch` in templates
- `@defer` for below-the-fold or secondary page content
- SSR or hybrid rendering for public catalog routes

## State Management

Use signals and facades, not a shared `BehaviorSubject` bucket.

- Component-local state: signals
- Feature state shared within a domain: facade service with signals
- Read-heavy async data: repository plus `httpResource` where appropriate
- Mutations: repository methods using `HttpClient`

Do not store domain state directly in components that also manage routing, DOM, and API calls.

## Integration Pattern

The storefront should depend on domain repositories, not raw endpoint shapes.

Example boundary:

- `CatalogRepository` hides CRM API details for product list and product detail
- `CheckoutRepository` hides order placement and shipping option details
- `AuthRepository` hides token/session mechanics

This prevents the app from becoming tightly coupled to temporary CRM contracts.

## Rendering Strategy

- SSR or prerender for home, category, search landing, and product detail pages
- Client-side interactions for cart, checkout, and authenticated account flows
- Avoid browser-only assumptions in shared services and route initialization

## Testing Strategy

- Unit tests for domain mappers, validators, utilities, and facades
- Component tests for standalone UI components and feature containers
- Route-level tests for guards, redirects, and critical navigation
- End-to-end tests for search, add-to-cart, checkout, and login flows

## Legacy Reuse vs Rewrite

### Reuse As Reference

- `../dealer-portal-Angular/src/app/pages/home/search-form/search-form.component.ts`
- `../dealer-portal-Angular/src/app/pages/wheels/wheels-listing/wheels-listing.component.ts`
- `../dealer-portal-Angular/src/app/pages/wheels/wheels-detail/wheels-detail.component.ts`
- `../dealer-portal-Angular/src/app/cart/shopping-cart/shopping-cart.component.ts`
- `../dealer-portal-Angular/src/app/cart/checkout/checkout.component.ts`

Reuse means:

- preserve business flow
- preserve user-facing search and commerce behavior where still valid
- extract useful request and response knowledge

It does not mean:

- copy the component structure
- reuse the old state model
- keep old routing, scripts, or services

### Rewrite

- `../dealer-portal-Angular/src/app/shared/services/api.service.ts`
- `../dealer-portal-Angular/src/app/shared/services/data.service.ts`
- `../dealer-portal-Angular/src/app/includes/header/header.component.ts`
- `../dealer-portal-Angular/src/app/pages/suppliers/suppliers.component.ts`
- `../dealer-portal-Angular/src/app/my-accounts/my-products/my-products.component.ts`
- `../dealer-portal-Angular/src/app/my-accounts/my-inventory/my-inventory.component.ts`
- `../dealer-portal-Angular/src/app/app.module.ts`
- `../dealer-portal-Angular/angular.json`

## Non-Goals

- Rebuilding legacy supplier/dealer admin in this repo
- Preserving every old route
- Preserving old API contracts indefinitely

