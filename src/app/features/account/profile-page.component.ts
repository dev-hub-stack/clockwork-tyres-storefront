import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type ProfileDetails = {
  businessName: string;
  address: string;
  country: string;
  licenseNumber: string;
  expiry: string;
  email: string;
  website: string;
  instagram: string;
  contactName: string;
  phone: string;
};

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly fb = new FormBuilder();

  protected readonly showEditForm = signal(false);
  protected readonly showPasswordForm = signal(false);
  protected readonly profile = signal<ProfileDetails>({
    businessName: 'Al Noor Tyres Trading',
    address: 'Al Quoz Industrial Area 3, Dubai',
    country: 'UAE',
    licenseNumber: 'TL-987654321',
    expiry: '2027-12-31',
    email: 'orders@alnoortyres.ae',
    website: 'https://www.alnoortyres.ae',
    instagram: '@alnoortyres',
    contactName: 'Mohammed Khalid',
    phone: '+971 50 123 4567'
  });

  protected readonly profileForm = this.fb.nonNullable.group({
    businessName: [this.profile().businessName, Validators.required],
    address: [this.profile().address, Validators.required],
    country: [this.profile().country, Validators.required],
    licenseNumber: [this.profile().licenseNumber, Validators.required],
    expiry: [this.profile().expiry, Validators.required],
    email: [this.profile().email, [Validators.required, Validators.email]],
    website: [this.profile().website],
    instagram: [this.profile().instagram],
    contactName: [this.profile().contactName, Validators.required],
    phone: [this.profile().phone, Validators.required]
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

    this.profile.set(this.profileForm.getRawValue());
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
