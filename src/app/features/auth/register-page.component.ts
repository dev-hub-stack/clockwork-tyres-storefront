import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BusinessAccountMode,
  BusinessPlanPreference,
  BusinessRegistrationApiService,
  BusinessRegistrationSuccessData,
  CountryOption
} from '../../core/auth';
import { STOREFRONT_PATHS } from '../../core/storefront-routes';

type RegistrationRoleOption = {
  value: BusinessAccountMode;
  label: string;
  note: string;
};

type RegistrationPlanOption = {
  value: BusinessPlanPreference;
  label: string;
  note: string;
};

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationApi = inject(BusinessRegistrationApiService);

  protected readonly benefits = [
    'One onboarding route for retailer, supplier, or combined business accounts',
    'Tyre-first launch with supplier preview and retail storefront support',
    'Subscription-ready intake aligned with Clockwork premium rules',
    'Shared account model for businesses that sell retail and wholesale'
  ];

  protected readonly roleOptions: RegistrationRoleOption[] = [
    { value: 'retailer', label: 'Retailer', note: 'Storefront ordering and admin portal' },
    { value: 'supplier', label: 'Supplier', note: 'Wholesale inventory and read-only store preview' },
    { value: 'both', label: 'Both', note: 'Single business account with shared stock pool' }
  ];

  protected readonly planOptions: RegistrationPlanOption[] = [
    {
      value: 'basic',
      label: 'Basic',
      note: 'Retailers limited to 3 suppliers. Suppliers have no reports access.'
    },
    {
      value: 'premium',
      label: 'Premium',
      note: 'Unlock own inventory, broader supplier network, and add-on report options.'
    }
  ];

  protected readonly countries = signal<CountryOption[]>([]);
  protected readonly submitError = signal<string | null>(null);
  protected readonly submitSuccess = signal<string | null>(null);
  protected readonly registrationSummary = signal<BusinessRegistrationSuccessData | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly selectedDocumentName = signal<string>('');

  protected readonly form = this.formBuilder.group({
    businessName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    country: ['', [Validators.required]],
    accountMode: ['retailer' as BusinessAccountMode, [Validators.required]],
    planPreference: ['basic' as BusinessPlanPreference, [Validators.required]],
    supportingDocument: [null as File | null, [Validators.required]],
    acceptsTerms: [false, [Validators.requiredTrue]],
    acceptsPrivacy: [false, [Validators.requiredTrue]]
  });

  constructor() {
    this.hydrateQueryDefaults();

    if (isPlatformBrowser(this.platformId)) {
      this.loadCountries();
    }
  }

  protected get uploadLabel(): string {
    const accountMode = this.form.controls.accountMode.value;

    if (accountMode === 'supplier') {
      return 'Upload business logo or trade license';
    }

    if (accountMode === 'both') {
      return 'Upload trade license or business proof';
    }

    return 'Upload trade license';
  }

  protected onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;

    this.form.controls.supportingDocument.setValue(file);
    this.form.controls.supportingDocument.markAsDirty();
    this.selectedDocumentName.set(file?.name ?? '');
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    this.submitError.set(null);
    this.submitSuccess.set(null);
    this.registrationSummary.set(null);

    if (this.form.invalid) {
      return;
    }

    const supportingDocument = this.form.controls.supportingDocument.value;

    if (!supportingDocument) {
      this.submitError.set('A supporting business document is required.');
      return;
    }

    this.isSubmitting.set(true);

    this.registrationApi
      .submit({
        businessName: this.form.controls.businessName.value?.trim() ?? '',
        email: this.form.controls.email.value?.trim() ?? '',
        password: this.form.controls.password.value ?? '',
        country: this.form.controls.country.value ?? '',
        accountMode: this.form.controls.accountMode.value ?? 'retailer',
        planPreference: this.form.controls.planPreference.value ?? 'basic',
        acceptsTerms: this.form.controls.acceptsTerms.value ?? false,
        acceptsPrivacy: this.form.controls.acceptsPrivacy.value ?? false,
        supportingDocument
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.submitSuccess.set(
            response.message || 'Registration request submitted successfully.'
          );
          this.registrationSummary.set(response.data);
          this.form.reset({
            businessName: '',
            email: '',
            password: '',
            country: this.resolveDefaultCountry(this.countries()),
            accountMode: 'retailer',
            planPreference: 'basic',
            supportingDocument: null,
            acceptsTerms: false,
            acceptsPrivacy: false
          });
          this.selectedDocumentName.set('');
        },
        error: (error: { error?: { message?: string; errors?: unknown } }) => {
          this.isSubmitting.set(false);
          this.submitError.set(
            error.error?.message ?? 'Registration request failed. Please try again.'
          );
        }
      });
  }

  private hydrateQueryDefaults(): void {
    const requestedPlan = this.activatedRoute.snapshot.queryParamMap.get('plan');

    if (requestedPlan === 'premium-plan' || requestedPlan === 'premium') {
      this.form.controls.planPreference.setValue('premium');
    }
  }

  private loadCountries(): void {
    this.registrationApi
      .loadCountries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);

          if (!this.form.controls.country.value) {
            this.form.controls.country.setValue(this.resolveDefaultCountry(countries));
          }
        },
        error: () => {
          this.countries.set([
            { id: 1, countryName: 'United Arab Emirates', countryCode: 'AE' }
          ]);
        }
      });
  }

  private resolveDefaultCountry(countries: CountryOption[]): string {
    const preferredCountry =
      countries.find((country) => country.countryName === 'United Arab Emirates') ??
      countries.find((country) => country.countryName === 'United States') ??
      countries[0];

    return preferredCountry?.countryName ?? '';
  }

  protected continueToLogin(): void {
    const email = this.registrationSummary()?.owner.email ?? this.form.controls.email.value ?? '';

    void this.router.navigate([`/${STOREFRONT_PATHS.login}`], {
      queryParams: {
        registered: 1,
        email
      }
    });
  }
}
