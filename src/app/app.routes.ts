import { Routes } from '@angular/router';
import { StorefrontLayoutComponent } from './core/layout/storefront-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: StorefrontLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'catalog'
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          )
      },
      {
        path: 'product/:sku',
        loadComponent: () =>
          import('./features/catalog/product-detail-page.component').then(
            (m) => m.ProductDetailPageComponent
          )
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart-page.component').then(
            (m) => m.CartPageComponent
          )
      },
      {
        path: 'cart/checkout',
        loadComponent: () =>
          import('./features/cart/checkout-page.component').then(
            (m) => m.CheckoutPageComponent
          )
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/account-shell.component').then(
            (m) => m.AccountShellComponent
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'profile'
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/account/profile-page.component').then(
                (m) => m.ProfilePageComponent
              )
          },
          {
            path: 'addresses',
            loadComponent: () =>
              import('./features/account/addresses-page.component').then(
                (m) => m.AddressesPageComponent
              )
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./features/account/orders-page.component').then(
                (m) => m.OrdersPageComponent
              )
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
