import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type PricingAudience = 'retailer' | 'supplier';

type PricingPlanCard = {
  slug: string;
  title: string;
  subtitle?: string;
  features: string[];
  priceLabel: string;
  billingNote?: string;
  ctaLabel: string;
  queryParams: Record<string, string>;
  isPopular?: boolean;
};

@Component({
  selector: 'app-home-shell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss'
})
export class HomeShellComponent {
  protected readonly pricingAudience = signal<PricingAudience>('retailer');

  protected readonly pricingAudiences: Array<{ value: PricingAudience; label: string }> = [
    { value: 'retailer', label: 'For Retailers' },
    { value: 'supplier', label: 'For Wholesalers' }
  ];

  private readonly pricingPlansByAudience: Record<PricingAudience, PricingPlanCard[]> = {
    retailer: [
      {
        slug: 'starter',
        title: 'Starter',
        features: ['Access to 3 suppliers', '24/7 Live inventory and ordering', 'Unlimited Orders'],
        priceLabel: 'FREE',
        ctaLabel: 'Sign up',
        queryParams: { mode: 'retailer', plan: 'basic' }
      },
      {
        slug: 'plus',
        title: 'Plus',
        subtitle: 'Everything in Starter and...',
        features: [
          'Add Unlimited Suppliers',
          'Change portal logo to company logo',
          'Manage and showcase on hand inventory',
          'Store Analytics'
        ],
        priceLabel: '199 AED/Month',
        billingNote: 'Billed Monthly',
        ctaLabel: 'Try for free',
        queryParams: { mode: 'retailer', plan: 'premium' },
        isPopular: true
      },
      {
        slug: 'enterprise',
        title: 'Enterprise',
        subtitle: 'For businesses that sell both wholesale and retail.',
        features: ['Customer Analytics'],
        priceLabel: 'Custom pricing',
        ctaLabel: 'Contact Sales',
        queryParams: { mode: 'both', plan: 'premium', enterprise: '1' }
      }
    ],
    supplier: [
      {
        slug: 'starter',
        title: 'Starter',
        features: [
          '24/7 Live inventory and order portal',
          'Unlimited Orders',
          'Inventory and product management admin'
        ],
        priceLabel: 'FREE',
        ctaLabel: 'Sign up',
        queryParams: { mode: 'supplier', plan: 'basic' }
      },
      {
        slug: 'premium',
        title: 'Premium',
        subtitle: 'For businesses that sell both wholesale and retail.',
        features: ['Retail sales portal', 'Procurement module', 'Store Analytics'],
        priceLabel: '199 AED/Month',
        billingNote: 'Billed Monthly',
        ctaLabel: 'Try for free',
        queryParams: { mode: 'supplier', plan: 'premium' },
        isPopular: true
      },
      {
        slug: 'enterprise',
        title: 'Enterprise',
        subtitle: 'For businesses that sell both wholesale and retail.',
        features: ['Customer Analytics'],
        priceLabel: 'Custom pricing',
        ctaLabel: 'Contact Sales',
        queryParams: { mode: 'both', plan: 'premium', enterprise: '1' }
      }
    ]
  };

  protected get displayedPricingPlans(): PricingPlanCard[] {
    return this.pricingPlansByAudience[this.pricingAudience()];
  }

  protected setPricingAudience(audience: PricingAudience): void {
    this.pricingAudience.set(audience);
  }
}
