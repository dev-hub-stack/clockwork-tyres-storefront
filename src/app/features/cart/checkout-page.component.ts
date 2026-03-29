import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type SavedAddress = {
  id: string;
  nickname: string;
  businessName: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  phone: string;
};

type CheckoutItem = {
  id: number;
  brand: string;
  model: string;
  sku: string;
  size: string;
  quantity: number;
  total: number;
  image: string;
};

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly savedAddresses: SavedAddress[] = [
    {
      id: 'warehouse-office',
      nickname: 'Warehouse Office',
      businessName: 'Al Noor Tyres Trading',
      country: 'UAE',
      state: 'Dubai',
      city: 'Dubai',
      zip: '11111',
      address: 'Al Quoz Industrial Area 3',
      phone: '+971 50 123 4567'
    },
    {
      id: 'showroom',
      nickname: 'Retail Showroom',
      businessName: 'Al Noor Tyres Trading',
      country: 'UAE',
      state: 'Abu Dhabi',
      city: 'Abu Dhabi',
      zip: '22222',
      address: 'Mussafah M12',
      phone: '+971 50 765 4321'
    }
  ];

  protected readonly checkoutItems: CheckoutItem[] = [
    {
      id: 1,
      brand: 'Michelin',
      model: 'Pilot Sport 4S',
      sku: 'CW-TYR-001',
      size: '325/30R21',
      quantity: 2,
      total: 750,
      image: '/assets/img/tire-go.jpg'
    },
    {
      id: 2,
      brand: 'Pirelli',
      model: 'P Zero',
      sku: 'CW-TYR-002',
      size: '285/45R21',
      quantity: 1,
      total: 390,
      image: '/assets/img/ty2.png'
    }
  ];

  protected readonly shippingSameAsBilling = signal(true);

  protected readonly checkoutForm = this.fb.nonNullable.group({
    savedAddress: [''],
    billing: this.fb.nonNullable.group({
      businessName: ['Al Noor Tyres Trading', Validators.required],
      country: ['UAE', Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: ['Al Quoz Industrial Area 3', Validators.required],
      phone: ['+971 50 123 4567', Validators.required]
    }),
    shippingSameAsBilling: [true],
    shipping: this.fb.nonNullable.group({
      businessName: ['Al Noor Tyres Trading', Validators.required],
      country: ['UAE', Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: ['Al Quoz Industrial Area 3', Validators.required],
      phone: ['+971 50 123 4567', Validators.required]
    }),
    purchaseOrderNo: ['CW-PO-2034'],
    orderNotes: ['Please call before delivery.'],
    deliveryOption: ['Delivery', Validators.required],
    paymentMethod: ['Debit/Credit Card', Validators.required]
  });

  protected readonly subtotal = computed(() =>
    this.checkoutItems.reduce((total, item) => total + item.total, 0)
  );

  protected readonly shippingCost = computed(() => 25);
  protected readonly tax = computed(() => this.subtotal() * 0.05);
  protected readonly grandTotal = computed(
    () => this.subtotal() + this.shippingCost() + this.tax()
  );

  constructor() {
    this.checkoutForm.controls.shippingSameAsBilling.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.shippingSameAsBilling.set(!!value);
      });
  }

  protected applySavedAddress(addressId: string): void {
    const selectedAddress = this.savedAddresses.find((address) => address.id === addressId);

    if (!selectedAddress) {
      return;
    }

    const addressPatch = {
      businessName: selectedAddress.businessName,
      country: selectedAddress.country,
      state: selectedAddress.state,
      city: selectedAddress.city,
      zip: selectedAddress.zip,
      address: selectedAddress.address,
      phone: selectedAddress.phone
    };

    this.checkoutForm.controls.billing.patchValue(addressPatch);

    if (this.shippingSameAsBilling()) {
      this.checkoutForm.controls.shipping.patchValue(addressPatch);
    }
  }

  protected submitOrder(): void {
    this.checkoutForm.markAllAsTouched();
  }
}
