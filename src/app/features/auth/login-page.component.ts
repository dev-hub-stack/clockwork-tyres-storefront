import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

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
  }

  protected submit(): void {
    this.form.markAllAsTouched();
  }
}
