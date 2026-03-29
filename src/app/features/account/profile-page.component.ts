import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorefrontDataService } from '../../core/storefront-data';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly fb = new FormBuilder();
  private readonly storefrontData = inject(StorefrontDataService);

  protected readonly showEditForm = signal(false);
  protected readonly showPasswordForm = signal(false);
  protected readonly profile = computed(() => this.storefrontData.profile());

  protected readonly profileForm = this.fb.nonNullable.group({
    businessName: [this.storefrontData.getProfile().businessName, Validators.required],
    address: [this.storefrontData.getProfile().address, Validators.required],
    country: [this.storefrontData.getProfile().country, Validators.required],
    licenseNumber: [this.storefrontData.getProfile().licenseNumber, Validators.required],
    expiry: [this.storefrontData.getProfile().expiry, Validators.required],
    email: [this.storefrontData.getProfile().email, [Validators.required, Validators.email]],
    website: [this.storefrontData.getProfile().website],
    instagram: [this.storefrontData.getProfile().instagram],
    contactName: [this.storefrontData.getProfile().contactName, Validators.required],
    phone: [this.storefrontData.getProfile().phone, Validators.required]
  });

  protected readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  protected toggleEditForm(): void {
    this.showEditForm.update((value) => !value);
    this.profileForm.reset(this.profile());
  }

  protected togglePasswordForm(): void {
    this.showPasswordForm.update((value) => !value);
    this.passwordForm.reset();
  }

  protected saveProfile(): void {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      return;
    }

    this.storefrontData.updateProfile({
      ...this.profile(),
      ...this.profileForm.getRawValue()
    });
    this.showEditForm.set(false);
  }

  protected changePassword(): void {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      return;
    }

    if (
      this.passwordForm.controls.newPassword.value !==
      this.passwordForm.controls.confirmPassword.value
    ) {
      return;
    }

    this.showPasswordForm.set(false);
    this.passwordForm.reset();
  }
}
