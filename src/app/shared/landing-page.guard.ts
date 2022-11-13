import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MenuCacheService} from './menu-cache.service';
import {ApiClientService} from '../api/client.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageGuard implements CanActivate {

  constructor(private readonly menu: MenuCacheService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly client: ApiClientService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree> | boolean {
    if (next.children.length) {
      return true;
    }

    return this.menu.load().pipe(map(prf => {
      const url = prf.landingPage;
      console.log(`🎈 Navigating to landing page: ${url}`);
      if (url) {
        return this.router.parseUrl(`/c/${url}`);
      } else {
        this.client.lockout.block('User not authorized');
        // return this.router.parseUrl(`/f/forbidden`);
      }
    }));
  }
}
