import {Injectable, OnDestroy} from '@angular/core';

import {Observable, ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {UserProfile} from '../api/dto';
import {UserService} from '../api/user.service';

/**
 * A cached version of `UserService` that also provides a view of the valid URLs.
 */
@Injectable({
  providedIn: 'root'
})
export class UserCacheService implements OnDestroy {
  private readonly destroy: Subject<any>;
  private readonly userProfile: ReplaySubject<UserProfile>;

  constructor(private readonly client: UserService) {
    this.destroy = new Subject();
    this.userProfile = new ReplaySubject(1);
    this.client.load()
      .pipe(takeUntil(this.destroy))
      .subscribe(prf => {
        this.userProfile.next(prf);
      });
  }

  /**
   * Loads the `UserProfile`.
   */
  load(): Observable<UserProfile> {
    return this.userProfile;
  }

  ngOnDestroy() {
    this.destroy.next();
  }

}
