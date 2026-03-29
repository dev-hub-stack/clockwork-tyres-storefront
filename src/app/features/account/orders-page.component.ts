import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

type OrderStatus = 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

type OrderItem = {
  id: number;
  name: string;
  sku: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderAddress = {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
};

type CustomerOrder = {
  id: number;
  createdAt: string;
  supplier: string;
  status: OrderStatus;
  trackingNumber: string;
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  items: OrderItem[];
  billing: OrderAddress;
  shippingAddress: OrderAddress;
};

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss'
})
export class OrdersPageComponent {
  private readonly fb = new FormBuilder();

  private readonly orders: CustomerOrder[] = [
    {
      id: 10342,
      createdAt: '2026-03-20',
      supplier: 'Michelin Gulf',
      status: 'Processing',
      trackingNumber: 'CW10342AE',
      subtotal: 750,
      shipping: 25,
      vat: 38,
      total: 813,
      items: [
        {
          id: 1,
          name: 'Pilot Sport 4S',
          sku: 'CW-TYR-001',
          size: '325/30R21',
          quantity: 2,
          price: 750,
          image: '/assets/img/tire-go.jpg'
        }
      ],
      billing: {
        name: 'Al Noor Tyres Trading',
        address: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971 50 123 4567'
      },
      shippingAddress: {
        name: 'Al Noor Tyres Trading',
        address: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971 50 123 4567'
      }
    },
    {
      id: 10301,
      createdAt: '2026-03-14',
      supplier: 'Pirelli Middle East',
      status: 'Shipped',
      trackingNumber: 'CW10301AE',
      subtotal: 390,
      shipping: 25,
      vat: 20,
      total: 435,
      items: [
        {
          id: 2,
          name: 'P Zero',
          sku: 'CW-TYR-002',
          size: '285/45R21',
          quantity: 1,
          price: 390,
          image: '/assets/img/ty2.png'
        }
      ],
      billing: {
        name: 'Al Noor Tyres Trading',
        address: 'Mussafah M12',
        city: 'Abu Dhabi',
        country: 'UAE',
        phone: '+971 50 765 4321'
      },
      shippingAddress: {
        name: 'Al Noor Tyres Trading',
        address: 'Mussafah M12',
        city: 'Abu Dhabi',
        country: 'UAE',
        phone: '+971 50 765 4321'
      }
    },
    {
      id: 10255,
      createdAt: '2026-02-26',
      supplier: 'Continental UAE',
      status: 'Completed',
      trackingNumber: 'CW10255AE',
      subtotal: 724,
      shipping: 25,
      vat: 37,
      total: 786,
      items: [
        {
          id: 3,
          name: 'SportContact 7',
          sku: 'CW-TYR-003',
          size: '255/35R19',
          quantity: 2,
          price: 724,
          image: '/assets/img/ty3.png'
        }
      ],
      billing: {
        name: 'Al Noor Tyres Trading',
        address: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971 50 123 4567'
      },
      shippingAddress: {
        name: 'Al Noor Tyres Trading',
        address: 'Al Quoz Industrial Area 3',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971 50 123 4567'
      }
    }
  ];

  protected readonly selectedOrder = signal<CustomerOrder | null>(null);
  protected readonly searchCriteria = signal({
    orderNumber: '',
    dateFrom: '',
    dateTo: '',
    orderStatus: ''
  });

  protected readonly searchForm = this.fb.nonNullable.group({
    orderNumber: [''],
    dateFrom: [''],
    dateTo: [''],
    orderStatus: ['']
  });

  protected readonly filteredOrders = computed(() => {
    const criteria = this.searchCriteria();

    return this.orders.filter((order) => {
      const matchesOrderNumber =
        !criteria.orderNumber || order.id.toString().includes(criteria.orderNumber.trim());
      const matchesStatus =
        !criteria.orderStatus || order.status === criteria.orderStatus;
      const matchesFrom = !criteria.dateFrom || order.createdAt >= criteria.dateFrom;
      const matchesTo = !criteria.dateTo || order.createdAt <= criteria.dateTo;

      return matchesOrderNumber && matchesStatus && matchesFrom && matchesTo;
    });
  });

  protected applyFilters(): void {
    this.searchCriteria.set(this.searchForm.getRawValue());
  }

  protected viewOrder(order: CustomerOrder): void {
    this.selectedOrder.set(order);
  }

  protected backToList(): void {
    this.selectedOrder.set(null);
  }

  protected statusClass(status: OrderStatus): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
