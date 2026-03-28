import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchByVehicleModalComponent } from '../search-by-vehicle-modal/search-by-vehicle-modal.component';
import { SearchBySizeModalComponent } from '../search-by-size-modal/search-by-size-modal.component';

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
  protected readonly showVehicleModal = signal(false);
  protected readonly showSizeModal = signal(false);
}
