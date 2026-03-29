import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorefrontDataService } from '../../core/storefront-data';
import { StorefrontModeStore } from '../../core/storefront-mode';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  protected readonly items = this.storefrontData.cart;
  protected readonly checkoutEnabled = this.storefrontData.checkoutEnabled;
  protected readonly checkoutCta = this.storefrontMode.ctaState('start-checkout');
  protected readonly modeViewModel = this.storefrontMode.viewModel;

  protected readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.lineTotal, 0)
  );

  protected readonly shipping = computed(() => (this.items().length ? 25 : 0));
  protected readonly vat = computed(() => this.subtotal() * 0.05);
  protected readonly grandTotal = computed(
    () => this.subtotal() + this.shipping() + this.vat()
  );

  protected increment(itemId: number, currentQuantity: number): void {
    this.storefrontData.updateCartLineQuantity(itemId, currentQuantity + 1);
  }

  protected decrement(itemId: number, currentQuantity: number): void {
    this.storefrontData.updateCartLineQuantity(itemId, currentQuantity - 1);
  }

  protected remove(itemId: number): void {
    this.storefrontData.removeCartLine(itemId);
  }

  protected clearCart(): void {
    this.storefrontData.clearCart();
  }
}
