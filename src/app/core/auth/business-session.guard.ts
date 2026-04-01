import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STOREFRONT_PATHS } from '../storefront-routes';
import { BusinessSessionService } from './business-session.service';

export const businessSessionGuard: CanActivateFn = (_route, state) => {
  const businessSession = inject(BusinessSessionService);

  if (businessSession.accessToken()) {
    return true;
  }

  return inject(Router).createUrlTree([`/${STOREFRONT_PATHS.login}`], {
    queryParams: {
      next: state.url
    }
  });
};
