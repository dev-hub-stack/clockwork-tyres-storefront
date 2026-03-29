import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  InMemoryStorefrontDataRepository,
  STOREFRONT_DATA_REPOSITORY
} from './core/storefront-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    InMemoryStorefrontDataRepository,
    { provide: STOREFRONT_DATA_REPOSITORY, useExisting: InMemoryStorefrontDataRepository }
  ]
};
