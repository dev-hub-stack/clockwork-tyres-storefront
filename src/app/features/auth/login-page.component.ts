import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BusinessLoginApiService,
  BusinessSessionService
} from '../../core/auth';
import { STOREFRONT_PATHS } from '../../core/storefront-routes';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly businessLoginApi = inject(BusinessLoginApiService);
  private readonly businessSession = inject(BusinessSessionService);

  protected readonly benefits = [
    '24/7 online ordering access',
    'Own stock first, then approved supplier stock',
    'Order history, invoices, and account controls',
    'Retail and wholesale access from one business account'
  ];

  protected readonly accountModes = [
    { label: 'Retailer', note: 'Storefront ordering' },
    { label: 'Supplier', note: 'Wholesale preview' },
    { label: 'Both', note: 'Shared account access' }
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected readonly submitError = signal<string | null>(null);
  protected readonly registrationNotice = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  constructor() {
    const shouldOpenRegister =
      this.activatedRoute.snapshot.queryParamMap.get('signup') === '1' ||
      this.activatedRoute.snapshot.queryParamMap.has('plan');

    if (shouldOpenRegister) {
      void this.router.navigate([`/${STOREFRONT_PATHS.register}`], {
        queryParams: this.activatedRoute.snapshot.queryParams,
        replaceUrl: true
      });
    }

    const prefilledEmail = this.activatedRoute.snapshot.queryParamMap.get('email');

    if (prefilledEmail) {
      this.form.controls.email.setValue(prefilledEmail);
    }

    if (this.activatedRoute.snapshot.queryParamMap.get('registered') === '1') {
      this.registrationNotice.set(
        'Your business account has been created. Log in with the same email and password to continue.'
      );
    }
  }

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    this.businessLoginApi
      .login({
        email: this.form.controls.email.getRawValue(),
        password: this.form.controls.password.getRawValue()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.businessSession.save(response.data);
          void this.router.navigate(['/catalog'], {
            queryParams: {
              ownerLogin: '1'
            },
            replaceUrl: true
          });
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting.set(false);
          this.submitError.set(
            error.error?.message ?? 'Login failed. Please check your email and password.'
          );
        }
      });
  }
}
