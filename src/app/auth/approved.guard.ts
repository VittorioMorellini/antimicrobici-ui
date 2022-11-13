import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  Router
} from '@angular/router';

import { FirstLoginGuard } from './first-login.guard';
import { PasswordExpiredGuard } from './password-expired.guard';

@Injectable()
export class ApprovedGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly firstLogin: FirstLoginGuard,
    private readonly pwdExpired: PasswordExpiredGuard) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const fl = this.firstLogin.canActivate(next, state);
    const pe = this.pwdExpired.canActivate(next, state);
    const can = !fl && !pe;
    if (fl) {
      this.router.navigate(['/login/confirm']);
    }
    if (pe) {
      this.router.navigate(['/login/chpwd']);
    }
    return can;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
