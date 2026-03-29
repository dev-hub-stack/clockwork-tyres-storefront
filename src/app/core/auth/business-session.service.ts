import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { BusinessAccountContext, BusinessLoginSuccessData } from './business-login.types';

const BUSINESS_SESSION_STORAGE_KEY = 'clockwork-business-session';

@Injectable({
  providedIn: 'root'
})
export class BusinessSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);

  readonly session = signal<BusinessLoginSuccessData | null>(this.readStoredSession());

  save(session: BusinessLoginSuccessData): void {
    this.session.set(session);

    if (!this.browser) {
      return;
    }

    window.localStorage.setItem(BUSINESS_SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  updateAccountContext(accountContext: BusinessAccountContext): void {
    const currentSession = this.session();

    if (!currentSession) {
      return;
    }

    this.save({
      ...currentSession,
      account_context: accountContext
    });
  }

  clear(): void {
    this.session.set(null);

    if (!this.browser) {
      return;
    }

    window.localStorage.removeItem(BUSINESS_SESSION_STORAGE_KEY);
  }

  accessToken(): string | null {
    return this.session()?.access_token ?? null;
  }

  private readStoredSession(): BusinessLoginSuccessData | null {
    if (!this.browser) {
      return null;
    }

    const raw = window.localStorage.getItem(BUSINESS_SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as BusinessLoginSuccessData;
    } catch {
      window.localStorage.removeItem(BUSINESS_SESSION_STORAGE_KEY);
      return null;
    }
  }
}
