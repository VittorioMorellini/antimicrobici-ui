import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {APP_CONFIG_TOKEN, AppConfig} from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroyed = new Subject();

  constructor(
    private router: Router,
    private title: Title,
    @Inject(APP_CONFIG_TOKEN) private cfg: AppConfig) { }

  ngOnInit() {
    // NOTE improve title change according to route data as described here
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.title.setTitle(this.cfg.commons.name);
    // NOTE this is a sort of hack that will help us redirect to /reparti
    // if / url is hitten; seems like there's no other way to do this
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroyed)
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/') {
          this.router.navigate(['/c']);
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }
}
