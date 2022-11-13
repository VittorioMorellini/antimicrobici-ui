import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApiModule } from './api/api.module';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nModule } from './i18n/i18n.module';
import { SharedModule } from './shared/shared.module';
import { APP_CONFIG, APP_CONFIG_TOKEN } from './app.config';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';
import { ViewsModule } from './views/views.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { MatDialogModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonsModule.forRoot(APP_CONFIG.commons),
    ApiModule.forRoot(APP_CONFIG.api),
    I18nModule.forRoot(APP_CONFIG.api),
    AuthModule.forRoot(APP_CONFIG.auth),
    SharedModule,
    LayoutModule,
    ViewsModule,
    BrowserAnimationsModule,
    GridModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    { provide: APP_CONFIG_TOKEN, useValue: APP_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
