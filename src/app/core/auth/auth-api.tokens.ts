import { InjectionToken } from '@angular/core';

export interface StorefrontAuthApiEndpoints {
  countries: string;
  register: string;
  login: string;
  accountContext: string;
  accountContextSelect: string;
}

export const STOREFRONT_AUTH_API_ENDPOINTS = new InjectionToken<StorefrontAuthApiEndpoints>(
  'STOREFRONT_AUTH_API_ENDPOINTS'
);
