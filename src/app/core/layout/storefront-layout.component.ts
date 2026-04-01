import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { StorefrontBootstrapService } from '../storefront-bootstrap';
import { BusinessSessionService } from '../auth';
import { ClockworkHeaderComponent } from '../../shared/ui/clockwork-header/clockwork-header.component';
import { CatalogCategoryService } from '../catalog-categories';
import { FitmentService } from '../fitment';
import { StorefrontDataService } from '../storefront-data';
import { StorefrontModeStore } from '../storefront-mode';
import { StorefrontCatalogSyncService } from '../storefront-data/storefront-catalog-sync.service';
import { getLeafRouteSnapshot, resolveStorefrontRouteContext, STOREFRONT_PATHS } from '../storefront-routes';

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
  private readonly businessSession = inject(BusinessSessionService);
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);
  private readonly storefrontBootstrap = inject(StorefrontBootstrapService);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);
  private readonly catalogSync = inject(StorefrontCatalogSyncService);

  private readonly routeSnapshot = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.route.snapshot),
      startWith(this.route.snapshot)
    ),
    { initialValue: this.route.snapshot }
  );

  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly fitmentViewModel = this.fitment.viewModel;
  protected readonly showStorefrontHeader = computed(() => {
    return resolveStorefrontRouteContext(this.routeSnapshot()).showStorefrontHeader;
  });

  constructor() {
    effect(() => {
      this.storefrontBootstrap.syncFromSnapshot(this.routeSnapshot());
    });

    effect(() => {
      const snapshot = getLeafRouteSnapshot(this.routeSnapshot());
      const path = snapshot.routeConfig?.path ?? '';

      if (this.businessSession.accessToken()) {
        return;
      }

      const isPublicRoute =
        path === STOREFRONT_PATHS.home ||
        path === STOREFRONT_PATHS.homeAlias ||
        path === STOREFRONT_PATHS.featureAlias;

      if (isPublicRoute) {
        return;
      }

      void this.router.navigate([`/${STOREFRONT_PATHS.login}`], {
        queryParams: {
          next: this.router.url
        },
        replaceUrl: true
      });
    });

    effect(() => {
      const session = this.storefrontBootstrap.session();

      this.storefrontMode.setMode(session.resolved.mode, session.resolved.modeContext);
      this.storefrontData.setMode(session.resolved.mode);

      this.catalogCategories.setCategory(session.resolved.category);
      this.storefrontData.setCategory(session.resolved.category);
      this.fitment.setContext({
        category: session.resolved.category,
        mode: session.resolved.fitmentMode,
        query: session.route.query
      });

      void this.catalogSync.syncCatalog(session.resolved.mode, session.resolved.category);
    });
  }
}
