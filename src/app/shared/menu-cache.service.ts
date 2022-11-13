import {Injectable, OnDestroy} from '@angular/core';

import {Observable, ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {MenuProfile} from '../api/dto';
import {MenuService} from '../api/menu.service';
import {transformBranches} from '../commons/commons';

function mkMenuUrls(prf: MenuProfile): string[] {
  return transformBranches(prf.menu,
    entry => entry.items || [],
    path => path.map(e => e.id).join('/'));
}

/**
 * A cached version of `MenuService` that also provides a view of the valid URLs.
 */
@Injectable({
  providedIn: 'root'
})
export class MenuCacheService implements OnDestroy {
  private readonly destroy: Subject<any>;

  private readonly menuProfile: ReplaySubject<MenuProfile>;
  private readonly menuUrls: ReplaySubject<string[]>;

  constructor(private readonly client: MenuService) {
    this.destroy = new Subject();
    this.menuProfile = new ReplaySubject(1);
    this.menuUrls = new ReplaySubject(1);

    this.client.load()
      .pipe(takeUntil(this.destroy))
      .subscribe(prf => {
        this.menuProfile.next(prf);

        const urls = mkMenuUrls(prf);
        console.debug('✈ Valid menu URLS', urls);
        this.menuUrls.next(urls);
      });
  }

  /**
   * Loads the `MenuProfile`.
   */
  load(): Observable<MenuProfile> {
    return this.menuProfile;
  }

  /**
   * An observable of allowed URLs that is backed by a `ReplaySubject`; always emits the last seen value
   * when a new subscriber subscribes.
   */
  get urls(): Observable<string[]> {
    return this.menuUrls;
  }

  ngOnDestroy() {
    this.destroy.next();
  }

}
