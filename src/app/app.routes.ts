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
