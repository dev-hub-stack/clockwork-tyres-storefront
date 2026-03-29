import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  StorefrontDataService,
  StorefrontOrder,
  StorefrontOrderLine
} from '../../core/storefront-data';

type OrderStatusValue = StorefrontOrder['status'];

type OrderItemView = {
  id: string;
  name: string;
  sku: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderAddressView = {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
};

type CustomerOrderView = {
  id: string;
  createdAt: string;
  supplier: string;
  status: string;
  statusValue: OrderStatusValue;
  trackingNumber: string;
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  items: OrderItemView[];
  billing: OrderAddressView;
  shippingAddress: OrderAddressView;
};

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly storefrontData = inject(StorefrontDataService);

  protected readonly selectedOrder = signal<CustomerOrderView | null>(null);
  protected readonly searchCriteria = signal<{
    orderNumber: string;
    dateFrom: string;
    dateTo: string;
    orderStatus: '' | OrderStatusValue;
  }>({
    orderNumber: '',
    dateFrom: '',
    dateTo: '',
    orderStatus: ''
  });

  protected readonly searchForm = this.fb.nonNullable.group({
    orderNumber: [''],
    dateFrom: [''],
    dateTo: [''],
    orderStatus: ['' as '' | OrderStatusValue]
  });

  protected readonly orders = computed(() =>
    this.storefrontData.orders().map((order) => this.mapOrder(order))
  );

  protected readonly filteredOrders = computed(() => {
    const criteria = this.searchCriteria();

    return this.orders().filter((order) => {
      const matchesOrderNumber =
        !criteria.orderNumber ||
        order.id.toLowerCase().includes(criteria.orderNumber.trim().toLowerCase());
      const matchesStatus =
        !criteria.orderStatus || order.statusValue === criteria.orderStatus;
      const matchesFrom = !criteria.dateFrom || order.createdAt >= criteria.dateFrom;
      const matchesTo = !criteria.dateTo || order.createdAt <= criteria.dateTo;

      return matchesOrderNumber && matchesStatus && matchesFrom && matchesTo;
    });
  });

  protected applyFilters(): void {
    this.searchCriteria.set(this.searchForm.getRawValue());
  }

  protected viewOrder(order: CustomerOrderView): void {
    this.selectedOrder.set(order);
  }

  protected backToList(): void {
    this.selectedOrder.set(null);
  }

  protected statusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  private mapOrder(order: StorefrontOrder): CustomerOrderView {
    return {
      id: order.id,
      createdAt: order.createdAt,
      supplier: order.supplierName,
      status: this.formatStatus(order.status),
      statusValue: order.status,
      trackingNumber: order.trackingNumber,
      subtotal: order.subtotal,
      shipping: order.shippingAmount,
      vat: order.vat,
      total: order.total,
      items: order.lines.map((line, index) => this.mapOrderLine(line, index)),
      billing: {
        name: order.billing.businessName,
        address: order.billing.address,
        city: order.billing.city,
        country: order.billing.country,
        phone: order.billing.phone
      },
      shippingAddress: {
        name: order.shipping.businessName,
        address: order.shipping.address,
        city: order.shipping.city,
        country: order.shipping.country,
        phone: order.shipping.phone
      }
    };
  }

  private mapOrderLine(line: StorefrontOrderLine, index: number): OrderItemView {
    return {
      id: `${line.sku}-${index}`,
      name: line.title,
      sku: line.sku,
      size: line.size,
      quantity: line.quantity,
      price: line.unitPrice,
      image:
        this.storefrontData.getProductBySku(line.sku, 'retail-store')?.image ??
        '/assets/img/tire-go.jpg'
    };
  }

  private formatStatus(status: OrderStatusValue): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
