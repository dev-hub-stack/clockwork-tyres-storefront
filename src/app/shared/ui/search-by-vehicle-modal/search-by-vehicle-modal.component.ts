import { Component, computed, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogCategoryService } from '../../../core/catalog-categories';
import { FitmentService, type FitmentSearchFieldDefinition } from '../../../core/fitment';
import { STOREFRONT_PATHS, buildCatalogQueryParams } from '../../../core/storefront-routes';

@Component({
  selector: 'app-search-by-vehicle-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-by-vehicle-modal.component.html',
  styleUrl: './search-by-vehicle-modal.component.scss'
})
export class SearchByVehicleModalComponent {
  private readonly router = inject(Router);
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);

  readonly closed = output<void>();

  private readonly vehicleFieldOptions: Record<string, string[]> = {
    make: ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche'],
    model: ['3 Series', 'C Class', '911', 'RS6 Avant'],
    year: ['2021', '2022', '2023', '2024', '2025', '2026'],
    variant: ['Base', 'Sport', 'Performance', 'OEM Fitment'],
    modification: ['Base', 'AMG Line', 'S Line'],
    subModel: ['Premium', 'Sport', 'Launch Edition'],
    fitment: ['OEM', 'Staggered', 'Aggressive']
  };

  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly searchFields = computed(() =>
    this.fitment.getSearchFields('search-by-vehicle', this.activeCategory().id)
  );
  protected readonly formValues: Record<string, string | boolean> = {};

  protected getOptions(fieldKey: string): string[] {
    return this.vehicleFieldOptions[fieldKey] ?? [];
  }

  protected getPlaceholder(field: FitmentSearchFieldDefinition, index: number): string {
    const prefix = index + 1;
    return field.placeholder ?? `${prefix} | ${field.label}`;
  }

  protected getFieldValue(fieldKey: string): string {
    const value = this.formValues[fieldKey];
    return typeof value === 'string' ? value : '';
  }

  protected getToggleValue(fieldKey: string): boolean {
    return this.formValues[fieldKey] === true;
  }

  protected updateField(fieldKey: string, value: string | boolean): void {
    this.formValues[fieldKey] = value;
  }

  protected submit(): void {
    const query = Object.entries(this.formValues).reduce<Record<string, string | boolean>>(
      (params, [key, value]) => {
        if (value !== '' && value !== false) {
          params[key] = value;
        }

        return params;
      },
      {}
    );

    this.fitment.setContext({
      category: this.activeCategory().id,
      mode: 'search-by-vehicle',
      query
    });

    void this.router.navigate([`/${STOREFRONT_PATHS.searchByVehicle}`], {
      queryParams: {
        ...buildCatalogQueryParams(this.activeCategory().id, 'search-by-vehicle'),
        searchByVehicle: true,
        ...query
      }
    });

    this.closed.emit();
  }
}
