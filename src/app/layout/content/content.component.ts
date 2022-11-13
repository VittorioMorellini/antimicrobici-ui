import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';

import {Observable} from 'rxjs';

import {MenuProfile} from '../../api/dto';
import {MenuCacheService} from '../../shared/menu-cache.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  profile: Observable<MenuProfile>;
  isOpened = false;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly menu: MenuCacheService
              ) {
    this.profile = this.menu.load();
  }

  ngOnInit() {
  }

  landingPage(prf: MenuProfile): string[] {
    return ['/c', ...prf.landingPage.split('/')];
  }

  menuIDHandler(isOpened: boolean) {
    console.log('menu id')
    this.isOpened = isOpened;
  }

}
