import { Injectable, Signal, computed, signal } from '@angular/core';
import {
  buildStorefrontModeViewModel,
  getStorefrontCtaState,
  hasStorefrontCapability,
  resolveStorefrontModeId
} from './storefront-mode.helpers';
import {
  StorefrontCapabilityKey,
  StorefrontCtaKey,
  StorefrontCtaState,
  StorefrontModeContext,
  StorefrontModeId,
  StorefrontModeInput
} from './storefront-mode.types';

@Injectable({ providedIn: 'root' })
export class StorefrontModeStore {
  private readonly modeIdState = signal<StorefrontModeId>('retail-store');
  private readonly contextState = signal<StorefrontModeContext>({});

  readonly modeId = this.modeIdState.asReadonly();
  readonly context = this.contextState.asReadonly();

  readonly viewModel = computed(() =>
    buildStorefrontModeViewModel(this.modeIdState(), this.contextState())
  );

  readonly capabilities = computed(() => this.viewModel().capabilities);
  readonly ctas = computed(() => this.viewModel().ctas);
  readonly isRetailStore = computed(() => this.viewModel().isRetailStore);
  readonly isSupplierPreview = computed(() => this.viewModel().isSupplierPreview);
  readonly isReadOnly = computed(() => this.viewModel().readOnly);

  setMode(mode: StorefrontModeInput, context?: Partial<StorefrontModeContext>): void {
    this.modeIdState.set(resolveStorefrontModeId(mode));

    if (context) {
      this.setContext(context);
    }
  }

  setContext(context: Partial<StorefrontModeContext>): void {
    this.contextState.update((current) => ({ ...current, ...context }));
  }

  reset(mode: StorefrontModeInput = 'retail-store'): void {
    this.modeIdState.set(resolveStorefrontModeId(mode));
    this.contextState.set({});
  }

  hasCapability(capability: StorefrontCapabilityKey): boolean {
    return hasStorefrontCapability(this.modeIdState(), capability);
  }

  getCtaState(cta: StorefrontCtaKey): StorefrontCtaState {
    return getStorefrontCtaState(this.modeIdState(), cta);
  }

  ctaState(cta: StorefrontCtaKey): Signal<StorefrontCtaState> {
    return computed(() => this.getCtaState(cta));
  }
}
