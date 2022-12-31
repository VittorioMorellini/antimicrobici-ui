import { Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import * as _ from 'lodash';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LockoutService } from '../auth/lockout.service';
import { MenuCacheService } from './menu-cache.service';

function mkPath(path: ActivatedRouteSnapshot[]): string {
  const urls = _.flatMap(path, ars => ars.url);
  // drops the initial /c url
  return _.drop(urls).map(s => s.path).join('/');
}

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate {
  constructor(
    private readonly menu: MenuCacheService,
    private readonly router: Router,
    @Optional() private lockout: LockoutService
  ) 
  { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const path = mkPath(next.pathFromRoot);
    console.log({path})
    return this.menu.urls.pipe(map(urls => {
      console.log({urls})
      const allowed = urls.indexOf(path) >= 0;
      if (!allowed) {
        console.error(`🚫 Not allowed to access: ${path}`);
        if (this.lockout) {
          return this.router.parseUrl(this.lockout.forbid());
        }
        return false;
      }
      return true;
    }));
  }
}
