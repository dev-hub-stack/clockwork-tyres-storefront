import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogCategoryService } from '../../../core/catalog-categories';
import { FitmentService } from '../../../core/fitment';
import { SearchByVehicleModalComponent } from '../search-by-vehicle-modal/search-by-vehicle-modal.component';
import { SearchBySizeModalComponent } from '../search-by-size-modal/search-by-size-modal.component';
import { BusinessOwnerWorkspaceService } from '../../../core/auth';
import { StorefrontDataService } from '../../../core/storefront-data';
import { StorefrontModeStore } from '../../../core/storefront-mode';

@Component({
  selector: 'app-clockwork-header',
  standalone: true,
  imports: [
    RouterLink,
    SearchByVehicleModalComponent,
    SearchBySizeModalComponent
  ],
  templateUrl: './clockwork-header.component.html',
  styleUrl: './clockwork-header.component.scss'
})
export class ClockworkHeaderComponent {
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);
  private readonly router = inject(Router);
  private readonly businessWorkspace = inject(BusinessOwnerWorkspaceService);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  protected readonly showVehicleModal = signal(false);
  protected readonly showSizeModal = signal(false);
  protected readonly isLoggingOut = signal(false);
  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly isBusinessAuthenticated = this.businessWorkspace.isAuthenticated;
  protected readonly businessAccountName = this.businessWorkspace.currentAccountName;
  protected readonly businessAccountTypeLabel = this.businessWorkspace.currentAccountTypeLabel;
  protected readonly availableAccountCount = computed(() => this.businessWorkspace.availableAccounts().length);
  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly cartEnabled = this.storefrontData.cartEnabled;
  protected readonly cartCount = computed(() => this.storefrontData.cart().length);
  protected readonly catalogQueryParams = computed(() => {
    const params: Record<string, string> = {
      fitmentMode: this.fitment.searchMode()
    };

    if (this.activeCategory().id !== 'tyres') {
      params['category'] = this.activeCategory().id;
    }

    return params;
  });

  protected async logout(): Promise<void> {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLoggingOut.set(true);

    try {
      await this.businessWorkspace.logout();
      await this.router.navigate(['/catalog'], { replaceUrl: true });
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}
