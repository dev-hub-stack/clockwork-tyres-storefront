import { Injectable, computed, signal } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  createStorefrontBootstrapState,
  normalizeStorefrontBootstrapApiEndpoints,
  normalizeStorefrontBootstrapAccountContext,
  resolveStorefrontBootstrapRouteState,
  resolveStorefrontBootstrapState
} from './storefront-bootstrap.helpers';
import {
  StorefrontBootstrapAccountContext,
  StorefrontBootstrapResolvedState,
  StorefrontBootstrapRouteState,
  StorefrontBootstrapState
} from './storefront-bootstrap.types';

@Injectable({
  providedIn: 'root'
})
export class StorefrontBootstrapStore {
  private readonly state = signal<StorefrontBootstrapState>(createStorefrontBootstrapState());

  readonly route = computed(() => this.state().route);
  readonly account = computed(() => this.state().account);
  readonly endpoints = computed(() => this.state().endpoints);
  readonly resolved = computed(() => this.state().resolved);
  readonly session = computed(() => this.state());

  readonly isReady = computed(() => this.state().route.initialized);
  readonly mode = computed(() => this.resolved().mode);
  readonly category = computed(() => this.resolved().category);
  readonly fitmentMode = computed(() => this.resolved().fitmentMode);
  readonly modeContext = computed(() => this.resolved().modeContext);
  readonly source = computed(() => this.resolved().source);

  syncFromRouteSnapshot(snapshot: ActivatedRouteSnapshot): void {
    const nextRoute = resolveStorefrontBootstrapRouteState(snapshot);
    this.syncFromRouteState(nextRoute);
  }

  syncFromRouteState(route: StorefrontBootstrapRouteState): void {
    this.state.update((current) => {
      const normalizedRoute: StorefrontBootstrapRouteState = {
        ...route,
        initialized: true
      };

      return {
        ...current,
        route: normalizedRoute,
        resolved: resolveStorefrontBootstrapState(normalizedRoute, current.account)
      };
    });
  }

  setAccountContext(account: StorefrontBootstrapAccountContext | null): void {
    const normalizedAccount = normalizeStorefrontBootstrapAccountContext(account);

    this.state.update((current) => ({
      ...current,
      account: normalizedAccount,
      resolved: resolveStorefrontBootstrapState(current.route, normalizedAccount)
    }));
  }

  setEndpoints(endpoints: Parameters<typeof normalizeStorefrontBootstrapApiEndpoints>[0]): void {
    this.state.update((current) => ({
      ...current,
      endpoints: normalizeStorefrontBootstrapApiEndpoints(endpoints)
    }));
  }

  updateResolvedContext(resolved: Partial<StorefrontBootstrapResolvedState>): void {
    this.state.update((current) => ({
      ...current,
      resolved: {
        ...current.resolved,
        ...resolved
      }
    }));
  }

  reset(): void {
    this.state.set(createStorefrontBootstrapState());
  }
}
