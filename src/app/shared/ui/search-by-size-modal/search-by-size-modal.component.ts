import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-by-size-modal',
  standalone: true,
  templateUrl: './search-by-size-modal.component.html',
  styleUrl: './search-by-size-modal.component.scss'
})
export class SearchBySizeModalComponent {
  readonly closed = output<void>();

  protected readonly diameters = ['18"', '19"', '20"', '21"'];
  protected readonly widths = ['8.5', '9.0', '9.5', '10.5'];
  protected readonly boltPatterns = ['5x112', '5x114.3', '6x139.7'];
}
