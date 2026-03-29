import { Routes } from '@angular/router';
import { StorefrontLayoutComponent } from './core/layout/storefront-layout.component';
import { STOREFRONT_PATHS } from './core/storefront-routes';

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
        path: STOREFRONT_PATHS.homeAlias,
        pathMatch: 'full',
        redirectTo: STOREFRONT_PATHS.home
      },
      {
        path: STOREFRONT_PATHS.featureAlias,
        pathMatch: 'full',
        redirectTo: STOREFRONT_PATHS.home
      },
      {
        path: STOREFRONT_PATHS.catalog,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          )
      },
      {
        path: STOREFRONT_PATHS.tyres,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          category: 'tyres'
        }
      },
      {
        path: STOREFRONT_PATHS.wheels,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          category: 'wheels'
        }
      },
      {
        path: STOREFRONT_PATHS.searchBySize,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          fitmentMode: 'search-by-size'
        }
      },
      {
        path: STOREFRONT_PATHS.searchByVehicle,
        loadComponent: () =>
          import('./features/catalog/catalog-page.component').then(
            (m) => m.CatalogPageComponent
          ),
        data: {
          fitmentMode: 'search-by-vehicle'
        }
      },
      {
        path: STOREFRONT_PATHS.legacySearchByVehicle,
        redirectTo: STOREFRONT_PATHS.searchByVehicle
      },
      {
        path: `${STOREFRONT_PATHS.product}/:sku`,
        loadComponent: () =>
          import('./features/catalog/product-detail-page.component').then(
            (m) => m.ProductDetailPageComponent
          )
      },
      {
        path: STOREFRONT_PATHS.cart,
        loadComponent: () =>
          import('./features/cart/cart-page.component').then(
            (m) => m.CartPageComponent
          )
      },
      {
        path: STOREFRONT_PATHS.checkout,
        loadComponent: () =>
          import('./features/cart/checkout-page.component').then(
            (m) => m.CheckoutPageComponent
          )
      },
      {
        path: STOREFRONT_PATHS.cartAccount,
        pathMatch: 'full',
        redirectTo: `/${STOREFRONT_PATHS.login}`
      },
      {
        path: STOREFRONT_PATHS.account,
        loadComponent: () =>
          import('./features/account/account-shell.component').then(
            (m) => m.AccountShellComponent
          ),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: STOREFRONT_PATHS.accountProfile
          },
          {
            path: STOREFRONT_PATHS.accountProfile,
            loadComponent: () =>
              import('./features/account/profile-page.component').then(
                (m) => m.ProfilePageComponent
              )
          },
          {
            path: STOREFRONT_PATHS.accountAddresses,
            loadComponent: () =>
              import('./features/account/addresses-page.component').then(
                (m) => m.AddressesPageComponent
              )
          },
          {
            path: STOREFRONT_PATHS.accountOrders,
            loadComponent: () =>
              import('./features/account/orders-page.component').then(
                (m) => m.OrdersPageComponent
              )
          }
        ]
      },
      {
        path: STOREFRONT_PATHS.myAccount,
        pathMatch: 'full',
        redirectTo: `${STOREFRONT_PATHS.account}/${STOREFRONT_PATHS.accountProfile}`
      },
      {
        path: STOREFRONT_PATHS.myProfile,
        pathMatch: 'full',
        redirectTo: `${STOREFRONT_PATHS.account}/${STOREFRONT_PATHS.accountProfile}`
      },
      {
        path: STOREFRONT_PATHS.myAddresses,
        pathMatch: 'full',
        redirectTo: `${STOREFRONT_PATHS.account}/${STOREFRONT_PATHS.accountAddresses}`
      },
      {
        path: STOREFRONT_PATHS.myInvoices,
        pathMatch: 'full',
        redirectTo: `${STOREFRONT_PATHS.account}/${STOREFRONT_PATHS.accountOrders}`
      },
      {
        path: STOREFRONT_PATHS.profileDashboard,
        pathMatch: 'full',
        redirectTo: `${STOREFRONT_PATHS.account}/${STOREFRONT_PATHS.accountOrders}`
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
