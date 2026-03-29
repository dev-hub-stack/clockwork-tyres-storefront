import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type HomeHighlight = {
  label: string;
  value: string;
};

type HomeSection = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaLink: string;
  reverse?: boolean;
};

@Component({
  selector: 'app-home-shell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-shell.component.html',
  styleUrl: './home-shell.component.scss'
})
export class HomeShellComponent {
  protected readonly highlights: HomeHighlight[] = [
    {
      label: 'Tyre-first launch',
      value: 'Built for tyre retail, supplier stock, and subscription-based admin.'
    },
    {
      label: 'Merged stock view',
      value: 'Own stock stays first, then approved supplier stock behind the same product.'
    },
    {
      label: 'Search-led flow',
      value: 'Vehicle search and size search stay at the center of the storefront.'
    },
    {
      label: 'Future wheels ready',
      value: 'The launch is tyres-only, but the category seam stays open for wheels later.'
    }
  ];

  protected readonly sections: HomeSection[] = [
    {
      id: 'overview',
      eyebrow: 'What is Clockwork Tyres?',
      title: 'A familiar Clockwork landing, rebuilt for the tyre business',
      copy:
        'The storefront keeps the same direct, inventory-first Clockwork feel, but the message now speaks to tyres, live stock, and supplier-connected retail.',
      bullets: [
        'Retailers can search tyres by vehicle or size and move straight into the catalog.',
        'Approved supplier stock is visible in the same product entry, with supplier identity hidden.',
        'The experience stays visual and operational, not like a generic SaaS dashboard.'
      ],
      image: '/assets/img/banner1.png',
      imageAlt: 'Clockwork Tyres hero reference',
      ctaLabel: 'Explore tyres',
      ctaLink: '/tyres'
    },
    {
      id: 'search',
      eyebrow: 'Search',
      title: 'Keep the search-first journey that users already know',
      copy:
        'The legacy Clockwork landing pages leaned heavily on search. This version keeps that behavior, but makes tyres the launch category and leaves the wheel seam ready for later.',
      bullets: [
        'Search by vehicle keeps the fitment journey fast.',
        'Search by size stays available as a direct discovery path.',
        'The storefront routes remain simple and predictable.'
      ],
      image: '/assets/img/new-search.png',
      imageAlt: 'Legacy-style search illustration',
      ctaLabel: 'Search by vehicle',
      ctaLink: '/search-by-vehicle',
      reverse: true
    },
    {
      id: 'platform',
      eyebrow: 'Operations',
      title: 'Show the platform value without losing the storefront feel',
      copy:
        'The home shell should still feel like Clockwork, but the supporting message should make the platform outcome clear: stock, suppliers, warehouses, and account control in one place.',
      bullets: [
        'Supplier stock, inventory, and warehouses stay visible in the story.',
        'Account and order management remain part of the broader platform.',
        'The same shell can later support wheels without changing the layout language.'
      ],
      image: '/assets/img/dashboard.png',
      imageAlt: 'Platform operations dashboard reference',
      ctaLabel: 'Open account',
      ctaLink: '/account/profile'
    }
  ];
}
