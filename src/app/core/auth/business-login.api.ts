import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { STOREFRONT_AUTH_API_ENDPOINTS, StorefrontAuthApiEndpoints } from './auth-api.tokens';
import {
  BusinessForgotPasswordSuccess,
  BusinessLoginPayload,
  BusinessLoginSuccess
} from './business-login.types';

@Injectable({
  providedIn: 'root'
})
export class BusinessLoginApiService {
  private readonly http = inject(HttpClient);

  constructor(
    @Inject(STOREFRONT_AUTH_API_ENDPOINTS) private readonly endpoints: StorefrontAuthApiEndpoints
  ) {
  }

  login(payload: BusinessLoginPayload) {
    return this.http.post<BusinessLoginSuccess>(this.endpoints.login, {
      email: payload.email.trim().toLowerCase(),
      password: payload.password
    }).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => ({
          error: {
            message:
              error.error?.message ??
              'Login failed. Please check your email and password and try again.'
          }
        }))
      )
    );
  }

  forgot(email: string) {
    return this.http.post<BusinessForgotPasswordSuccess>(this.endpoints.forgot, {
      email: email.trim().toLowerCase()
    }).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => ({
          error: {
            message:
              error.error?.message ??
              'We could not send the reset link right now. Please try again.'
          }
        }))
      )
    );
  }
}
