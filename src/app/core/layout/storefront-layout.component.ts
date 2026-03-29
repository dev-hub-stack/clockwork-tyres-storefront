import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';
import { ClockworkHeaderComponent } from '../../shared/ui/clockwork-header/clockwork-header.component';
import { CatalogCategoryService } from '../catalog-categories';
import { FitmentService } from '../fitment';
import { StorefrontDataService } from '../storefront-data';
import { StorefrontModeStore } from '../storefront-mode';
import { filter, map, startWith } from 'rxjs';

type StorefrontRouteContext = {
  category: string | null;
  fitmentMode: string | null;
  storefrontMode: string | null;
  showStorefrontHeader: boolean;
  query: Record<string, string>;
};

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [RouterOutlet, ClockworkHeaderComponent],
  templateUrl: './storefront-layout.component.html',
  styleUrl: './storefront-layout.component.scss'
})
export class StorefrontLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  private readonly routeContext = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.buildRouteContext()),
      startWith(this.buildRouteContext())
    ),
    { initialValue: this.buildRouteContext() }
  );

  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly fitmentViewModel = this.fitment.viewModel;
  protected readonly showStorefrontHeader = computed(() => this.routeContext().showStorefrontHeader);

  constructor() {
    effect(() => {
      const nextRouteContext = this.routeContext();
      const nextMode = nextRouteContext.storefrontMode;
      const normalizedMode =
        nextMode === 'retail-store' ||
        nextMode === 'supplier-preview' ||
        nextMode === 'retail' ||
        nextMode === 'supplier' ||
        nextMode === 'preview'
          ? nextMode
          : null;

      this.storefrontMode.setMode(normalizedMode);
      this.storefrontData.setMode(this.storefrontMode.modeId());

      const categoryId = this.catalogCategories.resolveCategoryId(nextRouteContext.category);
      this.catalogCategories.setCategory(categoryId);
      this.storefrontData.setCategory(categoryId);
      this.fitment.setContext({
        category: categoryId,
        mode: nextRouteContext.fitmentMode,
        query: this.extractFitmentQuery(nextRouteContext.query)
      });
    });
  }

  private buildRouteContext(): StorefrontRouteContext {
    const leafSnapshot = this.getLeafSnapshot(this.route.snapshot);
    const query = this.collectQueryParams(this.route.snapshot.queryParamMap);
    const categoryFromData = this.getStringRouteData(leafSnapshot, 'category');
    const fitmentModeFromData = this.getStringRouteData(leafSnapshot, 'fitmentMode');

    return {
      category: query['category'] ?? categoryFromData,
      fitmentMode: this.resolveFitmentMode(query, fitmentModeFromData),
      storefrontMode: query['mode'] ?? null,
      showStorefrontHeader: this.getBooleanRouteData(leafSnapshot, 'useStorefrontHeader', true),
      query
    };
  }

  private getLeafSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let currentSnapshot = snapshot;

    while (currentSnapshot.firstChild) {
      currentSnapshot = currentSnapshot.firstChild;
    }

    return currentSnapshot;
  }

  private getStringRouteData(
    snapshot: ActivatedRouteSnapshot,
    key: 'category' | 'fitmentMode'
  ): string | null {
    const value = snapshot.data[key];
    return typeof value === 'string' ? value : null;
  }

  private getBooleanRouteData(
    snapshot: ActivatedRouteSnapshot,
    key: string,
    fallback: boolean
  ): boolean {
    const value = snapshot.data[key];
    return typeof value === 'boolean' ? value : fallback;
  }

  private collectQueryParams(paramMap: ActivatedRouteSnapshot['queryParamMap']): Record<string, string> {
    return paramMap.keys.reduce<Record<string, string>>((params, key) => {
      const value = paramMap.get(key);

      if (value !== null) {
        params[key] = value;
      }

      return params;
    }, {});
  }

  private resolveFitmentMode(
    query: Record<string, string>,
    fitmentModeFromData: string | null
  ): string | null {
    if (query['fitmentMode'] === 'search-by-vehicle' || fitmentModeFromData === 'search-by-vehicle') {
      return 'search-by-vehicle';
    }

    if (
      query['searchByVehicle'] === 'true' ||
      query['searchByVehicle'] === '1' ||
      query['search_by_vehicle'] === 'true'
    ) {
      return 'search-by-vehicle';
    }

    if (query['fitmentMode'] === 'search-by-size' || fitmentModeFromData === 'search-by-size') {
      return 'search-by-size';
    }

    if (
      query['search_by_size'] === 'true' ||
      query['searchBySize'] === 'true' ||
      query['searchBySize'] === '1'
    ) {
      return 'search-by-size';
    }

    return fitmentModeFromData;
  }

  private extractFitmentQuery(query: Record<string, string>): Record<string, string> {
    const reservedKeys = new Set([
      'category',
      'fitmentMode',
      'mode',
      'searchByVehicle',
      'searchBySize',
      'search_by_size',
      'search_by_vehicle'
    ]);

    return Object.entries(query).reduce<Record<string, string>>((fitmentQuery, [key, value]) => {
      if (!reservedKeys.has(key)) {
        fitmentQuery[key] = value;
      }

      return fitmentQuery;
    }, {});
  }
}
