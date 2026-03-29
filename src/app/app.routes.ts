import { Routes } from '@angular/router';
import { StorefrontLayoutComponent } from './core/layout/storefront-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: StorefrontLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home-shell.component').then(
            (m) => m.HomeShellComponent
          ),
        data: {
          useStorefrontHeader: false
        }
      },
      {
        path: 'home',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: 'feature',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          )
      },
      {
        path: 'tyres',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          category: 'tyres'
        }
      },
      {
        path: 'wheels',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          category: 'wheels'
        }
      },
      {
        path: 'search-by-size',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          fitmentMode: 'search-by-size'
        }
      },
      {
        path: 'search-by-vehicle',
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          fitmentMode: 'search-by-vehicle'
        }
      },
      {
        path: 'serchvehicle',
        redirectTo: 'search-by-vehicle'
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
        path: 'cart/account',
        pathMatch: 'full',
        redirectTo: '/login'
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
      },
      {
        path: 'my-account',
        pathMatch: 'full',
        redirectTo: 'account/profile'
      },
      {
        path: 'my-account/my-profile',
        pathMatch: 'full',
        redirectTo: 'account/profile'
      },
      {
        path: 'my-account/address-books',
        pathMatch: 'full',
        redirectTo: 'account/addresses'
      },
      {
        path: 'my-account/my-invoices',
        pathMatch: 'full',
        redirectTo: 'account/orders'
      },
      {
        path: 'profile-dashboard',
        pathMatch: 'full',
        redirectTo: 'account/orders'
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
