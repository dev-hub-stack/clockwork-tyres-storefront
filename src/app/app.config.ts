import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  businessAuthInterceptor,
  STOREFRONT_AUTH_API_ENDPOINTS
} from './core/auth';
import {
  STOREFRONT_BOOTSTRAP_API_URL,
  StorefrontBootstrapApiService
} from './core/storefront-bootstrap';
import {
  ApiStorefrontDataRepository,
  STOREFRONT_DATA_REPOSITORY
} from './core/storefront-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([businessAuthInterceptor])),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: STOREFRONT_BOOTSTRAP_API_URL, useValue: '/api/storefront/bootstrap' },
    {
      provide: STOREFRONT_AUTH_API_ENDPOINTS,
      useValue: {
        countries: '/api/countries',
        register: '/api/auth/business-register',
        login: '/api/auth/business-login',
        forgot: '/api/auth/forgot',
        accountContext: '/api/account-context',
        accountContextSelect: '/api/account-context/select',
        workspace: '/api/storefront/workspace',
        orders: '/api/storefront/orders'
      }
    },
    provideAppInitializer(() => inject(StorefrontBootstrapApiService).hydrate()),
    ApiStorefrontDataRepository,
    { provide: STOREFRONT_DATA_REPOSITORY, useExisting: ApiStorefrontDataRepository }
  ]
};
