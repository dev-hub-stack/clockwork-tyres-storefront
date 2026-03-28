import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-by-vehicle-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-by-vehicle-modal.component.html',
  styleUrl: './search-by-vehicle-modal.component.scss'
})
export class SearchByVehicleModalComponent {
  readonly closed = output<void>();

  protected readonly makes = ['Audi', 'BMW', 'Mercedes'];
  protected readonly models = ['R8', '3 Series', 'C Class'];
  protected readonly years = ['2020', '2021', '2022', '2024'];
  protected readonly subModels = ['5.2i', '340i', 'AMG Line'];
  protected make = this.makes[0];
  protected model = this.models[0];
  protected year = this.years[0];
  protected subModel = this.subModels[0];
}
