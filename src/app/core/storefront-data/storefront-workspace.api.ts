import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  STOREFRONT_AUTH_API_ENDPOINTS,
  StorefrontAuthApiEndpoints,
  BusinessSessionService
} from '../auth';
import { StorefrontWorkspaceApiResponse } from './storefront-workspace.api.types';

@Injectable({
  providedIn: 'root'
})
export class StorefrontWorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly businessSession = inject(BusinessSessionService);

  constructor(
    @Inject(STOREFRONT_AUTH_API_ENDPOINTS) private readonly endpoints: StorefrontAuthApiEndpoints
  ) {
  }

  hasAuthenticatedSession(): boolean {
    return Boolean(this.businessSession.accessToken());
  }

  async fetchWorkspace(): Promise<StorefrontWorkspaceApiResponse['data'] | null> {
    if (!this.hasAuthenticatedSession()) {
      return null;
    }

    const response = await firstValueFrom(
      this.http.get<StorefrontWorkspaceApiResponse>(this.endpoints.workspace)
    );

    if (!response.status || !response.data) {
      return null;
    }

    return response.data;
  }
}
