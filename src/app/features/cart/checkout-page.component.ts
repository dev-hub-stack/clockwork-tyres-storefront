import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorefrontCheckoutPayload, StorefrontDataService } from '../../core/storefront-data';
import { StorefrontBootstrapService } from '../../core/storefront-bootstrap';
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
  private readonly router = inject(Router);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontBootstrap = inject(StorefrontBootstrapService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  protected readonly profile = this.storefrontData.profile;
  protected readonly savedAddresses = this.storefrontData.addresses;
  protected readonly checkoutItems = this.storefrontData.cart;
  protected readonly workspaceStatus = this.storefrontData.workspaceStatus;
  protected readonly workspaceError = this.storefrontData.workspaceError;
  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly submitCheckoutCta = this.storefrontMode.ctaState('submit-checkout');
  protected readonly shippingSameAsBilling = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly checkoutForm = this.fb.nonNullable.group({
    savedAddress: [''],
    billing: this.fb.nonNullable.group({
      businessName: ['', Validators.required],
      country: ['', Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    }),
    shippingSameAsBilling: [true],
    shipping: this.fb.nonNullable.group({
      businessName: ['', Validators.required],
      country: ['', Validators.required],
      state: ['Dubai', Validators.required],
      city: ['Dubai', Validators.required],
      zip: ['11111', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    }),
    purchaseOrderNo: ['CW-PO-2034'],
    orderNotes: ['Please call before delivery.'],
    deliveryOption: ['Delivery', Validators.required]
  });

  protected readonly subtotal = computed(() =>
    this.checkoutItems().reduce((total, item) => total + item.lineTotal, 0)
  );

  protected readonly shippingCost = computed(() => 25);
  protected readonly tax = computed(() => this.subtotal() * 0.05);
  protected readonly grandTotal = computed(
    () => this.subtotal() + this.shippingCost() + this.tax()
  );
  protected readonly paymentMessage =
    'Payments are handled in store only. This checkout captures the order and reserved stock.';

  constructor() {
    this.checkoutForm.controls.shippingSameAsBilling.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.shippingSameAsBilling.set(!!value);
      });

    effect(() => {
      if (this.workspaceStatus() !== 'ready') {
        return;
      }

      const profile = this.profile();
      const addressPatch = {
        businessName: profile.businessName,
        country: profile.country,
        address: profile.address,
        phone: profile.phone
      };

      const billing = this.checkoutForm.controls.billing;
      const shipping = this.checkoutForm.controls.shipping;

      if (!billing.dirty || !billing.controls.businessName.value.trim()) {
        billing.patchValue(addressPatch, { emitEvent: false });
      }

      if (this.shippingSameAsBilling() && (!shipping.dirty || !shipping.controls.businessName.value.trim())) {
        shipping.patchValue(
          {
            ...shipping.getRawValue(),
            ...addressPatch
          },
          { emitEvent: false }
        );
      }
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

  protected async submitOrder(): Promise<void> {
    if (!this.submitCheckoutCta().enabled || this.isSubmitting()) {
      return;
    }

    this.checkoutForm.markAllAsTouched();

    if (!this.checkoutItems().length) {
      this.submitError.set('Your cart is empty. Add at least one tyre before checkout.');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.submitError.set('Please complete the billing and shipping details before placing the order.');
      return;
    }

    const accountKey = this.storefrontBootstrap.account()?.accountId ?? null;

    if (accountKey === null) {
      this.submitError.set('No active business account is selected for this checkout.');
      return;
    }

    const billing = this.checkoutForm.controls.billing.getRawValue();
    const shipping = this.shippingSameAsBilling()
      ? { ...billing }
      : this.checkoutForm.controls.shipping.getRawValue();

    const payload: StorefrontCheckoutPayload = {
      billing,
      shipping,
      purchaseOrderNo: this.normalizeOptionalValue(this.checkoutForm.controls.purchaseOrderNo.value),
      orderNotes: this.normalizeOptionalValue(this.checkoutForm.controls.orderNotes.value),
      deliveryOption: this.checkoutForm.controls.deliveryOption.getRawValue() as 'Pick up from warehouse' | 'Delivery',
      items: this.checkoutItems().map((item) => ({
        sku: item.sku,
        slug: item.slug,
        title: item.title,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        origin: item.origin,
        availabilityLabel: item.availabilityLabel
      }))
    };

    this.submitError.set(null);
    this.isSubmitting.set(true);

    try {
      const result = await this.storefrontData.submitOrder(payload, accountKey);

      if (!result) {
        this.submitError.set('We could not place the order right now. Please try again.');
        return;
      }

      await this.router.navigate(['/account/orders']);
    } catch {
      this.submitError.set('We could not place the order right now. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private normalizeOptionalValue(value: string | null | undefined): string | null {
    const normalized = value?.trim() ?? '';

    return normalized.length ? normalized : null;
  }
}
