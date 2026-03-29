import { computed, inject, Injectable } from '@angular/core';
import { StorefrontBootstrapApiService, StorefrontBootstrapService } from '../storefront-bootstrap';
import { StorefrontDataService } from '../storefront-data';
import { BusinessSessionService } from './business-session.service';
import { BusinessAccountMode } from './business-registration.types';

@Injectable({
  providedIn: 'root'
})
export class BusinessOwnerWorkspaceService {
  private readonly businessSession = inject(BusinessSessionService);
  private readonly storefrontBootstrap = inject(StorefrontBootstrapService);
  private readonly storefrontBootstrapApi = inject(StorefrontBootstrapApiService);
  private readonly storefrontData = inject(StorefrontDataService);

  readonly session = this.businessSession.session;
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly availableAccounts = computed(() => this.session()?.account_context.available_accounts ?? []);
  readonly currentAccountName = computed(() => {
    return (
      this.storefrontBootstrap.account()?.accountName ??
      this.session()?.account_context.current_account?.name ??
      null
    );
  });
  readonly currentAccountTypeLabel = computed(() => {
    return formatBusinessAccountType(
      this.storefrontBootstrap.account()?.accountType ??
        this.session()?.account_context.current_account?.account_type ??
        null
    );
  });

  async logout(): Promise<void> {
    this.businessSession.clear();
    this.storefrontBootstrap.reset();
    this.storefrontData.reset();
    await this.storefrontBootstrapApi.hydrate();
  }
}

function formatBusinessAccountType(accountType: BusinessAccountMode | null): string | null {
  switch (accountType) {
    case 'retailer':
      return 'Retailer';
    case 'supplier':
      return 'Supplier';
    case 'both':
      return 'Retail & Wholesale';
    default:
      return null;
  }
}
