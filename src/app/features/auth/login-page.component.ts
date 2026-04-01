import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BusinessLoginApiService,
  BusinessSessionService
} from '../../core/auth';
import { STOREFRONT_PATHS } from '../../core/storefront-routes';
import { StorefrontBootstrapApiService } from '../../core/storefront-bootstrap';

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
  private readonly storefrontBootstrapApi = inject(StorefrontBootstrapApiService);

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

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  protected readonly forgotMode = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly registrationNotice = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly isInteractive = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isInteractive.set(true);
    });

    if (this.businessSession.accessToken()) {
      const nextPath = this.resolveNextPath(this.activatedRoute.snapshot.queryParamMap.get('next'));

      void this.router.navigateByUrl(nextPath, {
        replaceUrl: true
      });

      return;
    }

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
    if (!this.isInteractive()) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.controls.email.invalid || (!this.forgotMode() && this.form.controls.password.invalid)) {
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    if (this.forgotMode()) {
      this.businessLoginApi
        .forgot(this.form.controls.email.getRawValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.isSubmitting.set(false);
            this.registrationNotice.set(response.message);
          },
          error: (error: { error?: { message?: string } }) => {
            this.isSubmitting.set(false);
            this.submitError.set(
              error.error?.message ?? 'We could not send the reset link right now.'
            );
          }
        });
      return;
    }

    this.businessLoginApi
      .login({
        email: this.form.controls.email.getRawValue(),
        password: this.form.controls.password.getRawValue()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.businessSession.save(response.data);
          const nextPath = this.resolveNextPath(this.activatedRoute.snapshot.queryParamMap.get('next'));
          this.isSubmitting.set(false);
          void this.router.navigateByUrl(nextPath, {
            replaceUrl: true
          });
          void this.storefrontBootstrapApi.hydrateAuthenticatedAccountContext(
            response.data.account_context
          );
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting.set(false);
          this.submitError.set(
            error.error?.message ?? 'Login failed. Please check your email and password.'
          );
        }
      });
  }

  protected showForgotPassword(): void {
    this.forgotMode.set(true);
    this.submitError.set(null);
    this.registrationNotice.set(null);
    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();
  }

  protected showLoginForm(): void {
    this.forgotMode.set(false);
    this.submitError.set(null);
    this.registrationNotice.set(null);
    this.form.controls.password.setValidators([Validators.required]);
    this.form.controls.password.updateValueAndValidity();
  }

  private resolveNextPath(nextPath: string | null): string {
    if (nextPath && nextPath.startsWith('/')) {
      return nextPath;
    }

    return '/catalog';
  }
}
