import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  STOREFRONT_BOOTSTRAP_API_URL,
  StorefrontBootstrapApiService
} from './core/storefront-bootstrap';
import {
  InMemoryStorefrontDataRepository,
  STOREFRONT_DATA_REPOSITORY
} from './core/storefront-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: STOREFRONT_BOOTSTRAP_API_URL, useValue: '/api/storefront/bootstrap' },
    provideAppInitializer(() => inject(StorefrontBootstrapApiService).hydrate()),
    InMemoryStorefrontDataRepository,
    { provide: STOREFRONT_DATA_REPOSITORY, useExisting: InMemoryStorefrontDataRepository }
  ]
};
