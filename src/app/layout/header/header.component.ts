import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserProfile} from '../../api/dto';

import {BusyService} from '../../commons/busy.service';
import {UserCacheService} from '../../shared/user-cache.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly destroyed = new Subject();
  userProfile: Observable<UserProfile>;
  nomeUtente: string;
  @Input() landingPage: string[];
  @Output() menuIDEvent: EventEmitter<boolean> = new EventEmitter();
  isOpened = false;

  constructor(private readonly router: Router,
              private readonly busy: BusyService,
              private readonly user: UserCacheService
              ) {
    this.user.load().subscribe(res => {
      this.nomeUtente = res.descrizione;
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.destroyed))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          this.busy.iamBusy();
        } else if (event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel) {
          this.busy.iamFree();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  hideMenu() {
    this.isOpened = !this.isOpened;
    this.menuIDEvent.emit(this.isOpened);
  }
}
