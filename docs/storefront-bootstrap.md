# Storefront Bootstrap Seam

This frontend now has a dedicated bootstrap/session layer in `src/app/core/storefront-bootstrap`.

## What It Does

- Resolves storefront mode, category, and fitment context from the route.
- Accepts future backend account context without changing the current screen logic.
- Keeps the mock-driven storefront data layer untouched for now.
- Gives the app one typed place to decide whether the current session is retail, supplier preview, or account-constrained.

## Current Flow

1. `StorefrontLayoutComponent` listens for navigation changes.
2. The layout sends the current snapshot into `StorefrontBootstrapService`.
3. The bootstrap store resolves the session state.
4. Existing core stores receive the resolved mode, category, and fitment context.

## Future Backend Hook

When the backend is ready, the app can call `setAccountContext(...)` with a payload containing:

- account id and name
- retailer/supplier/both flags
- enabled categories
- subscription/reporting data

That will let the bootstrap layer constrain category and mode without changing page components.

## Why This Exists

- Keeps the current mock UX stable.
- Avoids spreading route parsing across multiple pages.
- Creates a clean seam for backend account and category capabilities.
- Makes it easier to add wheels or other categories later without reworking the storefront shell.
