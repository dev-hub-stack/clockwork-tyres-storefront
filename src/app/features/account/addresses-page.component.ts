import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorefrontAddress, StorefrontDataService } from '../../core/storefront-data';

@Component({
  selector: 'app-addresses-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addresses-page.component.html',
  styleUrl: './addresses-page.component.scss'
})
export class AddressesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly storefrontData = inject(StorefrontDataService);

  protected readonly showForm = signal(false);
  protected readonly editingAddressId = signal<number | null>(null);
  protected readonly addresses = this.storefrontData.addresses;
  protected readonly businessName = computed(
    () => this.storefrontData.profile().businessName
  );

  protected readonly addressForm = this.fb.nonNullable.group({
    nickname: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    zip: ['', Validators.required]
  });

  protected openNewAddressForm(): void {
    this.editingAddressId.set(null);
    this.addressForm.reset({
      nickname: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    });
    this.showForm.set(true);
  }

  protected editAddress(address: StorefrontAddress): void {
    this.editingAddressId.set(address.id);
    this.addressForm.reset({
      nickname: address.nickname,
      address: address.address,
      phone: address.phone,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.zip
    });
    this.showForm.set(true);
  }

  protected deleteAddress(addressId: number): void {
    this.storefrontData.deleteAddress(addressId);
  }

  protected cancelForm(): void {
    this.showForm.set(false);
    this.editingAddressId.set(null);
  }

  protected saveAddress(): void {
    this.addressForm.markAllAsTouched();

    if (this.addressForm.invalid) {
      return;
    }

    const addressData = this.addressForm.getRawValue();
    const editingId = this.editingAddressId();
    const nextAddress: StorefrontAddress = {
      id: editingId ?? Date.now(),
      businessName: this.businessName(),
      ...addressData
    };

    if (editingId) {
      this.storefrontData.updateAddress(editingId, nextAddress);
    } else {
      this.storefrontData.addAddress(nextAddress);
    }

    this.cancelForm();
  }
}
