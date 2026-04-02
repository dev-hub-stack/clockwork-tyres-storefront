import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorefrontDataService } from '../../core/storefront-data';
import { StorefrontBootstrapApiService } from '../../core/storefront-bootstrap';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TitleCasePipe],
  templateUrl: './account-shell.component.html',
  styleUrl: './account-shell.component.scss'
})
export class AccountShellComponent {
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontBootstrapApi = inject(StorefrontBootstrapApiService);

  protected readonly profile = this.storefrontData.profile;
  protected readonly orders = this.storefrontData.orders;
  protected readonly addresses = this.storefrontData.addresses;
  protected readonly mode = this.storefrontData.mode;
  protected readonly workspaceStatus = this.storefrontData.workspaceStatus;
  protected readonly workspaceError = this.storefrontData.workspaceError;

  protected readonly modeLabel = computed(() =>
    this.mode() === 'retail-store' ? 'Retail Store' : 'Supplier Preview'
  );

  protected readonly accountNav = [
    { label: 'Profile', link: '/account/profile', exact: true },
    { label: 'Addresses', link: '/account/addresses', exact: false },
    { label: 'Orders', link: '/account/orders', exact: false }
  ];

  protected readonly accountStats = computed(() => [
    { label: 'Orders', value: String(this.orders().length) },
    { label: 'Addresses', value: String(this.addresses().length) },
    { label: 'Mode', value: this.modeLabel() }
  ]);

  protected retryWorkspace(): void {
    void this.storefrontBootstrapApi.hydrateAuthenticatedAccountContext();
  }
}
