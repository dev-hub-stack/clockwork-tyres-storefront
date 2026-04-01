import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { STOREFRONT_AUTH_API_ENDPOINTS } from './auth-api.tokens';
import { BusinessSessionService } from './business-session.service';

export const businessAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(BusinessSessionService);
  const endpoints = inject(STOREFRONT_AUTH_API_ENDPOINTS);
  const accessToken = session.accessToken();

  if (!accessToken || !shouldAttachToken(request.url, endpoints)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
};

function shouldAttachToken(
  url: string,
  endpoints: {
    accountContext: string;
    accountContextSelect: string;
    workspace: string;
    orders: string;
  }
): boolean {
  return (
    matches(url, endpoints.accountContext) ||
    matches(url, endpoints.accountContextSelect) ||
    matches(url, endpoints.workspace) ||
    matches(url, endpoints.orders) ||
    url.includes('/api/storefront/')
  );
}

function matches(url: string, endpoint: string): boolean {
  return url === endpoint || url.endsWith(endpoint);
}
