import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'catalog',
    renderMode: RenderMode.Client,
  },
  {
    path: 'tyres',
    renderMode: RenderMode.Client,
  },
  {
    path: 'wheels',
    renderMode: RenderMode.Client,
  },
  {
    path: 'search-by-size',
    renderMode: RenderMode.Client,
  },
  {
    path: 'search-by-vehicle',
    renderMode: RenderMode.Client,
  },
  {
    path: 'serchvehicle',
    renderMode: RenderMode.Client,
  },
  {
    path: 'product/:sku',
    renderMode: RenderMode.Client
  },
  {
    path: 'cart/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'account/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-account',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-account/my-profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-account/address-books',
    renderMode: RenderMode.Client,
  },
  {
    path: 'my-account/my-invoices',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile-dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Server
  },
  {
    path: 'register',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
