import {Injectable, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

import {AuthService} from './auth.service';

const LOGIN_ROUTE = '/login';
const FORBIDDEN_ROUTE = '/forbidden';

/**
 * Configuration class for lockout service.
 */
export class LockoutConfig {
  loginRoute?: string;
  forbiddenRoute?: string;
}

/**
 * A service that performs the lockout operation.
 */
@Injectable()
export class LockoutService {
  private readonly config: LockoutConfig;
  public readonly events = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    @Optional() config: LockoutConfig) {
    if (config) {
      this.config = Object.assign({loginRoute: LOGIN_ROUTE, forbiddenRoute: FORBIDDEN_ROUTE}, config);
    }
  }

  /**
   * Locks the user out of the application. Does not automatically perform a logout, no
   * backend is invoked with this method.
   *
   * @param url Optional url to redirect user to after a successful login
   */
  lockout(url?: string) {
    const extras = url ? {queryParams: {returnUrl: url}} : undefined;
    this.events.next();
    this.authService.lockout();
    this.router.navigate([this.config.loginRoute], extras);
  }

  /**
   * Temporarily blocks the user.
   *
   * @param reason The reason why the user is blocked
   */
  block(reason?: string) {
    const extras = reason ? {queryParams: {reason}} : undefined;
    this.authService.lockout();
    if (this.config.forbiddenRoute) {
      this.router.navigate([this.config.forbiddenRoute], extras);
    }
  }

  /**
   * Removes any authentication information and returns the path to the forbidden route.
   */
  forbid(): string {
    this.authService.lockout();
    return this.config.forbiddenRoute;
  }
}
