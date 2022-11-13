import { Component, OnInit, Input } from '@angular/core';

export enum IconType {
  Mat,
  FA
}

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() name: string;
  @Input() matClass: string | string[];
  @Input() faClass: string | string[];

  icon: string[];
  type: IconType;
  IconType = IconType;

  constructor() {
    this.icon = [];
  }

  ngOnInit() {
    if (!this.matClass) { this.matClass = []; }
    if (!this.faClass) { this.faClass = []; }

    if (!this.name) { return; }
    if (this.name.startsWith('mat-')) {
      // material icon
      this.icon = [this.name.substr(4)];
      this.type = IconType.Mat;
    } else if (this.name.startsWith('fas-') || this.name.startsWith('far-') || this.name.startsWith('fab-')) {
      // fontawesome
      this.icon = [this.name.substr(0, 3), this.name.substr(4)];
      this.type = IconType.FA;
    } else {
      // fallback to material icons
      this.icon = [this.name];
      this.type = IconType.Mat;
    }
  }

}
