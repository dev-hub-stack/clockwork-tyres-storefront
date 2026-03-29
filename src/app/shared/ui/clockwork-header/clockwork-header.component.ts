import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchByVehicleModalComponent } from '../search-by-vehicle-modal/search-by-vehicle-modal.component';
import { SearchBySizeModalComponent } from '../search-by-size-modal/search-by-size-modal.component';
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
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  protected readonly showVehicleModal = signal(false);
  protected readonly showSizeModal = signal(false);
  protected readonly modeViewModel = this.storefrontMode.viewModel;
  protected readonly cartEnabled = this.storefrontData.cartEnabled;
  protected readonly cartCount = computed(() => this.storefrontData.cart().length);
}
