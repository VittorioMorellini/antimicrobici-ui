import { animate, state, style, transition, trigger } from '@angular/animations';
import {Component, Input, OnInit} from '@angular/core';

import {MenuEntry} from '../../api/dto';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({height: '0px', display: 'none'})),
      state('expanded', style({height: '*', display: 'block'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ]
})
export class MenuComponent implements OnInit {
  @Input() entries: MenuEntry[];

  constructor() { }

  ngOnInit() {
  }

}
