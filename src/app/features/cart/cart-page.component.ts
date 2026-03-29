import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type CartItem = {
  id: number;
  brand: string;
  model: string;
  sku: string;
  size: string;
  loadIndex: string;
  speedRating: string;
  unitPrice: number;
  quantity: number;
  image: string;
};

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  protected readonly items = signal<CartItem[]>([
    {
      id: 1,
      brand: 'Michelin',
      model: 'Pilot Sport 4S',
      sku: 'CW-TYR-001',
      size: '325/30R21',
      loadIndex: '108',
      speedRating: 'Y',
      unitPrice: 375,
      quantity: 2,
      image: '/assets/img/tire-go.jpg'
    },
    {
      id: 2,
      brand: 'Pirelli',
      model: 'P Zero',
      sku: 'CW-TYR-002',
      size: '285/45R21',
      loadIndex: '113',
      speedRating: 'W',
      unitPrice: 390,
      quantity: 1,
      image: '/assets/img/ty2.png'
    }
  ]);

  protected readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  );

  protected readonly shipping = computed(() => (this.items().length ? 25 : 0));
  protected readonly vat = computed(() => this.subtotal() * 0.05);
  protected readonly grandTotal = computed(
    () => this.subtotal() + this.shipping() + this.vat()
  );

  protected increment(itemId: number): void {
    this.items.update((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  protected decrement(itemId: number): void {
    this.items.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  protected remove(itemId: number): void {
    this.items.update((items) => items.filter((item) => item.id !== itemId));
  }

  protected clearCart(): void {
    this.items.set([]);
  }

  protected itemTotal(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }
}
