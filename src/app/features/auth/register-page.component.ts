import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
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
    {
      icon: '/assets/img/icon-24.png',
      label: '24/7 online ordering access'
    },
    {
      icon: '/assets/img/box-icon.png',
      label: 'Manage orders from multiple suppliers'
    },
    {
      icon: '/assets/img/order-icon.png',
      label: 'Order history, tracking and invoices'
    },
    {
      icon: '/assets/img/folder-icon.png',
      label: 'Live inventory and pricing'
    }
  ];

  protected readonly roleOptions: RegistrationRoleOption[] = [
    { value: 'retailer', label: 'Retailer', note: 'Counter ordering plus retailer admin access' },
    { value: 'supplier', label: 'Supplier', note: 'Wholesale portal and product/inventory admin' },
    { value: 'both', label: 'Both', note: 'One business account with shared stock and paid subscription' }
  ];

  private readonly planOptionsByMode: Record<BusinessAccountMode, RegistrationPlanOption[]> = {
    retailer: [
      {
        value: 'basic',
        label: 'Starter (Free)',
        note: 'Access to 3 suppliers, live counter ordering, and unlimited orders.'
      },
      {
        value: 'premium',
        label: 'Plus (199 AED / Month)',
        note: 'Unlimited suppliers, own inventory showcase, company logo, and store analytics.'
      }
    ],
    supplier: [
      {
        value: 'basic',
        label: 'Starter (Free)',
        note: 'Live inventory and order portal, unlimited orders, and product/inventory admin.'
      },
      {
        value: 'premium',
        label: 'Premium (199 AED / Month)',
        note: 'Unlock retail sales portal, procurement module, and store analytics.'
      }
    ],
    both: [
      {
        value: 'premium',
        label: 'Paid Subscription Required',
        note: 'Combined retailer + wholesaler accounts cannot stay on the free plan.'
      }
    ]
  };

  protected readonly countries = signal<CountryOption[]>([]);
  protected readonly submitError = signal<string | null>(null);
  protected readonly submitSuccess = signal<string | null>(null);
  protected readonly registrationSummary = signal<BusinessRegistrationSuccessData | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly isInteractive = signal(false);
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
    afterNextRender(() => {
      this.isInteractive.set(true);
    });

    this.hydrateQueryDefaults();
    this.syncPlanPreferenceWithAccountMode(this.form.controls.accountMode.value ?? 'retailer');
    this.form.controls.accountMode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode) => this.syncPlanPreferenceWithAccountMode(mode ?? 'retailer'));

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

  protected get displayedPlanOptions(): RegistrationPlanOption[] {
    return this.planOptionsByMode[this.form.controls.accountMode.value ?? 'retailer'];
  }

  protected get selectedPlanNote(): string | null {
    const selectedPlan = this.displayedPlanOptions.find(
      (option) => option.value === (this.form.controls.planPreference.value ?? 'basic')
    );

    return selectedPlan?.note ?? null;
  }

  protected onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0] ?? null;

    this.form.controls.supportingDocument.setValue(file);
    this.form.controls.supportingDocument.markAsDirty();
    this.selectedDocumentName.set(file?.name ?? '');
  }

  protected submit(): void {
    if (!this.isInteractive()) {
      return;
    }

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

  private syncPlanPreferenceWithAccountMode(accountMode: BusinessAccountMode): void {
    if (accountMode === 'both') {
      this.form.controls.planPreference.setValue('premium');
      return;
    }

    if (!this.displayedPlanOptions.some((option) => option.value === this.form.controls.planPreference.value)) {
      this.form.controls.planPreference.setValue('basic');
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
