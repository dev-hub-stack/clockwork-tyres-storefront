import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {
  BusinessRegistrationPayload,
  BusinessRegistrationSuccess,
  CountriesApiResponse,
  CountryOption
} from './business-registration.types';

const FALLBACK_COUNTRIES: CountryOption[] = [
  { id: 1, countryName: 'United Arab Emirates', countryCode: 'AE' },
  { id: 2, countryName: 'Saudi Arabia', countryCode: 'SA' },
  { id: 3, countryName: 'Qatar', countryCode: 'QA' },
  { id: 4, countryName: 'Kuwait', countryCode: 'KW' },
  { id: 5, countryName: 'Bahrain', countryCode: 'BH' },
  { id: 6, countryName: 'Oman', countryCode: 'OM' },
  { id: 7, countryName: 'Pakistan', countryCode: 'PK' },
  { id: 8, countryName: 'United States', countryCode: 'US' }
];

@Injectable({
  providedIn: 'root'
})
export class BusinessRegistrationApiService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  loadCountries(): Observable<CountryOption[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(FALLBACK_COUNTRIES);
    }

    return this.http.get<CountriesApiResponse>('/api/countries').pipe(
      map((response) => response.data?.countries ?? []),
      map((countries) => (countries.length ? countries : FALLBACK_COUNTRIES)),
      catchError(() => of(FALLBACK_COUNTRIES))
    );
  }

  submit(payload: BusinessRegistrationPayload): Observable<BusinessRegistrationSuccess> {
    const formData = new FormData();

    formData.append('email', payload.email.trim().toLowerCase());
    formData.append('password', payload.password);
    formData.append('country', payload.country);
    formData.append('business_name', payload.businessName.trim());
    formData.append('name', payload.businessName.trim());
    formData.append('account_mode', payload.accountMode);
    formData.append('plan_preference', payload.planPreference);
    formData.append('type', payload.accountMode === 'supplier' ? 'Brand' : 'Retailer');
    formData.append('accepts_terms', String(payload.acceptsTerms));
    formData.append('accepts_privacy', String(payload.acceptsPrivacy));
    formData.append('registration_source', 'clockwork-tyres-storefront');
    formData.append(
      'trade_license',
      payload.supportingDocument,
      payload.supportingDocument.name
    );

    return this.http.post<BusinessRegistrationSuccess>(
      this.resolveEndpoint(payload.accountMode),
      formData
    ).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => ({
          error: {
            message:
              error.error?.message ??
              'Registration request failed. Please try again.'
          }
        }))
      )
    );
  }

  private resolveEndpoint(accountMode: BusinessRegistrationPayload['accountMode']): string {
    return accountMode === 'supplier' ? '/api/vendor' : '/api/dealer';
  }
}
