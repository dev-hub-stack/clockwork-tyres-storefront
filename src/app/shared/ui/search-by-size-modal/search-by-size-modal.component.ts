import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogCategoryService } from '../../../core/catalog-categories';
import { FitmentService, type FitmentSearchFieldDefinition } from '../../../core/fitment';

type SizeFieldSection = {
  id: 'primary' | 'front' | 'rear';
  title: string;
  fields: FitmentSearchFieldDefinition[];
};

@Component({
  selector: 'app-search-by-size-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-by-size-modal.component.html',
  styleUrl: './search-by-size-modal.component.scss'
})
export class SearchBySizeModalComponent {
  private readonly router = inject(Router);
  private readonly catalogCategories = inject(CatalogCategoryService);
  private readonly fitment = inject(FitmentService);

  readonly closed = output<void>();
  readonly showRearSizeFields = signal(false);

  private readonly fieldOptions: Record<string, string[]> = {
    width: ['205', '225', '245', '265', '285', '325'],
    aspectRatio: ['30', '35', '40', '45', '50', '55'],
    rimSize: ['17', '18', '19', '20', '21', '22'],
    loadIndex: ['92', '96', '100', '104', '108', '113'],
    speedRating: ['V', 'W', 'Y'],
    season: ['Summer', 'All Season', 'Winter'],
    rimDiameter: ['18', '19', '20', '21', '22'],
    rimWidth: ['8.5', '9.0', '9.5', '10.5'],
    boltPattern: ['5x112', '5x114.3', '6x139.7']
  };

  protected readonly activeCategory = this.catalogCategories.activeCategory;
  protected readonly searchFields = computed(() =>
    this.fitment.getSearchFields('search-by-size', this.activeCategory().id)
  );
  protected readonly primaryFields = computed(() =>
    this.searchFields().filter((field) => !this.isSectionField(field.key))
  );
  protected readonly frontFields = computed(() =>
    this.searchFields().filter((field) => this.isFrontSectionField(field.key))
  );
  protected readonly rearFields = computed(() =>
    this.searchFields().filter((field) => this.isRearSectionField(field.key))
  );
  protected readonly formValues: Record<string, string | boolean> = {};

  protected getOptions(fieldKey: string): string[] {
    return this.fieldOptions[fieldKey] ?? [];
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

  protected toggleRearSizeFields(): void {
    this.showRearSizeFields.update((value) => !value);
  }

  protected isSectionField(fieldKey: string): boolean {
    return this.isFrontSectionField(fieldKey) || this.isRearSectionField(fieldKey);
  }

  protected isFrontSectionField(fieldKey: string): boolean {
    return fieldKey.startsWith('front_');
  }

  protected isRearSectionField(fieldKey: string): boolean {
    return fieldKey.startsWith('rear_');
  }

  protected getSectionTitle(section: SizeFieldSection['id']): string {
    if (section === 'rear') {
      return 'Rear Wheel';
    }

    if (section === 'front') {
      return 'Front Wheel';
    }

    return `${this.activeCategory().label} Fitment`;
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
      mode: 'search-by-size',
      query
    });

    void this.router.navigate(['/search-by-size'], {
      queryParams: {
        ...(this.activeCategory().id !== 'tyres' ? { category: this.activeCategory().id } : {}),
        fitmentMode: 'search-by-size',
        search_by_size: true,
        ...query
      }
    });

    this.closed.emit();
  }
}
