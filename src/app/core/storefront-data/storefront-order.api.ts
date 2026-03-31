import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  BusinessSessionService,
  STOREFRONT_AUTH_API_ENDPOINTS,
  StorefrontAuthApiEndpoints
} from '../auth';
import { StorefrontCheckoutPayload, StorefrontCheckoutResult } from './storefront-data.models';
import { StorefrontOrderApiResponse } from './storefront-order.api.types';

@Injectable({
  providedIn: 'root'
})
export class StorefrontOrderApiService {
  private readonly http = inject(HttpClient);
  private readonly businessSession = inject(BusinessSessionService);

  constructor(
    @Inject(STOREFRONT_AUTH_API_ENDPOINTS) private readonly endpoints: StorefrontAuthApiEndpoints
  ) {
  }

  hasAuthenticatedSession(): boolean {
    return Boolean(this.businessSession.accessToken());
  }

  async createOrder(payload: StorefrontCheckoutPayload): Promise<StorefrontCheckoutResult | null> {
    if (!this.hasAuthenticatedSession()) {
      return null;
    }

    const response = await firstValueFrom(
      this.http.post<StorefrontOrderApiResponse>(this.endpoints.orders, payload)
    );

    if (!response.status || !response.data?.order) {
      return null;
    }

    return response.data.order;
  }
}
