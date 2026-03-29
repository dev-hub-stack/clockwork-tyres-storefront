import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ClockworkHeaderComponent } from '../../shared/ui/clockwork-header/clockwork-header.component';
import { CatalogCategoryService } from '../catalog-categories';
import { FitmentService } from '../fitment';
import { StorefrontDataService } from '../storefront-data';
import { StorefrontModeStore } from '../storefront-mode';
import { extractFitmentQueryParams, resolveStorefrontRouteContext } from '../storefront-routes';
import { filter, map, startWith } from 'rxjs';

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
      map(() => resolveStorefrontRouteContext(this.route.snapshot)),
      startWith(resolveStorefrontRouteContext(this.route.snapshot))
    ),
    { initialValue: resolveStorefrontRouteContext(this.route.snapshot) }
  );

  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly fitmentViewModel = this.fitment.viewModel;
  protected readonly showStorefrontHeader = computed(() => this.routeContext().showStorefrontHeader);

  constructor() {
    effect(() => {
      const nextRouteContext = this.routeContext();
      this.storefrontMode.setMode(nextRouteContext.storefrontMode);
      this.storefrontData.setMode(this.storefrontMode.modeId());

      const categoryId = this.catalogCategories.resolveCategoryId(nextRouteContext.category);
      this.catalogCategories.setCategory(categoryId);
      this.storefrontData.setCategory(categoryId);
      this.fitment.setContext({
        category: categoryId,
        mode: nextRouteContext.fitmentMode,
        query: extractFitmentQueryParams(nextRouteContext.query)
      });
    });
  }
}
