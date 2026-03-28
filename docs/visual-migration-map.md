# Visual Migration Map

Date: March 29, 2026

## Purpose

This map connects the legacy Clockwork storefront files to the first Angular 21 target files in this repo.

It is based on a code audit of:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular`

## Current Migration Targets

### Header

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\includes\header\header.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\includes\header\header.component.scss`

Current target:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\clockwork-header\clockwork-header.component.ts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\clockwork-header\clockwork-header.component.html`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\clockwork-header\clockwork-header.component.scss`

### Search By Vehicle

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-vehicle\search-by-vehicle.component.html`

Current target:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-vehicle-modal\search-by-vehicle-modal.component.ts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-vehicle-modal\search-by-vehicle-modal.component.html`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-vehicle-modal\search-by-vehicle-modal.component.scss`

### Search By Size

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\shared\components\search-by-size\search-by-size.component.html`

Current target:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-size-modal\search-by-size-modal.component.ts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-size-modal\search-by-size-modal.component.html`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\shared\ui\search-by-size-modal\search-by-size-modal.component.scss`

### Login

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\login\login.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\login\login.component.scss`

Current target:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\auth\login-page.component.ts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\auth\login-page.component.html`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\auth\login-page.component.scss`

### Listing Shell

Legacy source:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-listing\wheels-listing.component.html`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\app\pages\wheels\wheels-listing\wheels-listing.component.scss`

Current target:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\catalog\catalog-page.component.ts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\catalog\catalog-page.component.html`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\app\features\catalog\catalog-page.component.scss`

## Asset Base

Copied asset base:

- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\assets\fonts`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\assets\img`
- `C:\Users\Dell\Documents\Gerorge\clockwork-tyres-storefront\src\assets\css`

Important source references:

- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\style.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\main.scss`
- `C:\Users\Dell\Documents\Gerorge\dealer-portal-Angular\src\assets\css\styles\_variables.scss`

## Next UI Targets

The next visual migration slices should be:

1. product detail page
2. product card component
3. cart page
4. checkout shell
5. account basics shell

## Rule

For each storefront screen:

- preserve the legacy Clockwork visual design
- rebuild the behavior in Angular 21
- keep old B2B admin logic out of the new storefront repo
