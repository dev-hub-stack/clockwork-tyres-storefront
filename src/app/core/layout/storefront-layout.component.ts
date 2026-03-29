import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ClockworkHeaderComponent } from '../../shared/ui/clockwork-header/clockwork-header.component';
import { StorefrontDataService } from '../storefront-data';
import { StorefrontModeStore } from '../storefront-mode';
import { map } from 'rxjs';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [RouterOutlet, ClockworkHeaderComponent],
  templateUrl: './storefront-layout.component.html',
  styleUrl: './storefront-layout.component.scss'
})
export class StorefrontLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly storefrontData = inject(StorefrontDataService);
  private readonly storefrontMode = inject(StorefrontModeStore);

  private readonly modeFromQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('mode'))),
    { initialValue: null }
  );

  protected readonly modeViewModel = this.storefrontMode.viewModel;

  constructor() {
    effect(() => {
      const nextMode = this.modeFromQuery();
      const normalizedMode =
        nextMode === 'retail-store' ||
        nextMode === 'supplier-preview' ||
        nextMode === 'retail' ||
        nextMode === 'supplier' ||
        nextMode === 'preview'
          ? nextMode
          : null;

      this.storefrontMode.setMode(normalizedMode);
      this.storefrontData.setMode(this.storefrontMode.modeId());
    });
  }
}
