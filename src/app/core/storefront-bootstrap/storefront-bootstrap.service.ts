import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  StorefrontBootstrapAccountContext,
  StorefrontBootstrapResolvedState,
  StorefrontBootstrapRouteState,
  StorefrontBootstrapApiEndpoints,
} from './storefront-bootstrap.types';
import { StorefrontBootstrapStore } from './storefront-bootstrap.store';

@Injectable({
  providedIn: 'root'
})
export class StorefrontBootstrapService {
  private readonly store = inject(StorefrontBootstrapStore);

  readonly session = this.store.session;
  readonly route = this.store.route;
  readonly account = this.store.account;
  readonly endpoints = this.store.endpoints;
  readonly resolved = this.store.resolved;
  readonly isReady = this.store.isReady;
  readonly mode = this.store.mode;
  readonly category = this.store.category;
  readonly fitmentMode = this.store.fitmentMode;
  readonly modeContext = this.store.modeContext;
  readonly source = this.store.source;

  readonly accountLabel = computed(() => this.resolved().accountLabel);

  syncFromSnapshot(snapshot: ActivatedRouteSnapshot): void {
    this.store.syncFromRouteSnapshot(snapshot);
  }

  syncFromRouteState(route: StorefrontBootstrapRouteState): void {
    this.store.syncFromRouteState(route);
  }

  setAccountContext(account: StorefrontBootstrapAccountContext | null): void {
    this.store.setAccountContext(account);
  }

  setEndpoints(endpoints: StorefrontBootstrapApiEndpoints | null): void {
    this.store.setEndpoints(endpoints);
  }

  updateResolvedContext(resolved: Partial<StorefrontBootstrapResolvedState>): void {
    this.store.updateResolvedContext(resolved);
  }

  reset(): void {
    this.store.reset();
  }
}
