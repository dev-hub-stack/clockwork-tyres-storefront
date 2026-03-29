import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type AddressCard = {
  id: number;
  nickname: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

@Component({
  selector: 'app-addresses-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addresses-page.component.html',
  styleUrl: './addresses-page.component.scss'
})
export class AddressesPageComponent {
  private readonly fb = new FormBuilder();

  protected readonly showForm = signal(false);
  protected readonly editingAddressId = signal<number | null>(null);
  protected readonly addresses = signal<AddressCard[]>([
    {
      id: 1,
      nickname: 'Warehouse Office',
      address: 'Al Quoz Industrial Area 3',
      phone: '+971 50 123 4567',
      city: 'Dubai',
      state: 'Dubai',
      country: 'UAE',
      zip: '11111'
    },
    {
      id: 2,
      nickname: 'Retail Showroom',
      address: 'Mussafah M12',
      phone: '+971 50 765 4321',
      city: 'Abu Dhabi',
      state: 'Abu Dhabi',
      country: 'UAE',
      zip: '22222'
    }
  ]);

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

  protected editAddress(address: AddressCard): void {
    this.editingAddressId.set(address.id);
    this.addressForm.reset(address);
    this.showForm.set(true);
  }

  protected deleteAddress(addressId: number): void {
    this.addresses.update((addresses) =>
      addresses.filter((address) => address.id !== addressId)
    );
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

    if (editingId) {
      this.addresses.update((addresses) =>
        addresses.map((address) =>
          address.id === editingId ? { id: editingId, ...addressData } : address
        )
      );
    } else {
      this.addresses.update((addresses) => [
        ...addresses,
        { id: Date.now(), ...addressData }
      ]);
    }

    this.cancelForm();
  }
}
