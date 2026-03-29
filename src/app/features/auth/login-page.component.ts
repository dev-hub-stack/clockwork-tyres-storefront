import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);

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

  protected submit(): void {
    this.form.markAllAsTouched();
  }
}
