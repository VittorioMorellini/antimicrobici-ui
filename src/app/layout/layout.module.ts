import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonsModule } from '../commons/commons.module';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './content/content.component';
import { FocusComponent } from './focus/focus.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { LoadingScreenComponent } from './loading/loading-screen.component';

@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    MenuComponent,
    FocusComponent,
    LoadingScreenComponent
  ],
  imports: [
    // angular
    CommonModule,
    RouterModule,
    // app
    SharedModule,
    CommonsModule
  ],
  exports: [ContentComponent, FocusComponent]
})
export class LayoutModule { }
