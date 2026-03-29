import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorefrontDataService } from '../../core/storefront-data';
import { StorefrontModeStore } from '../../core/storefront-mode';

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
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);
  private readonly profile = this.storefrontData.getProfile();

  protected readonly savedAddresses = this.storefrontData.addresses;
  protected readonly checkoutItems = this.storefrontData.cart;
  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly submitCheckoutCta = this.storefrontMode.ctaState('submit-checkout');
  protected readonly shippingSameAsBilling = signal(true);

  protected readonly checkoutForm = this.fb.nonNullable.group({
    savedAddress: [''],
    billing: this.fb.nonNullable.group({
      businessName: [this.profile.businessName, Validators.required],
      country: [this.profile.country, Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: [this.profile.address, Validators.required],
      phone: [this.profile.phone, Validators.required]
    }),
    shippingSameAsBilling: [true],
    shipping: this.fb.nonNullable.group({
      businessName: [this.profile.businessName, Validators.required],
      country: [this.profile.country, Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: [this.profile.address, Validators.required],
      phone: [this.profile.phone, Validators.required]
    }),
    purchaseOrderNo: ['CW-PO-2034'],
    orderNotes: ['Please call before delivery.'],
    deliveryOption: ['Delivery', Validators.required],
    paymentMethod: ['Debit/Credit Card', Validators.required]
  });

  protected readonly subtotal = computed(() =>
    this.checkoutItems().reduce((total, item) => total + item.lineTotal, 0)
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
    const selectedAddress = this.savedAddresses().find(
      (address) => address.id.toString() === addressId
    );

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
    if (!this.submitCheckoutCta().enabled) {
      return;
    }

    this.checkoutForm.markAllAsTouched();
  }
}
