// angular
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// i18n
import { I18NService, I18NConfig, load } from './i18n.service';
import {
  I18NPipe,
  I18NNumPipe,
  I18NParsePipe,
  I18NDatePipe,
  I18NDateTimePipe,
  I18NTimestampPipe
} from './i18n.pipe';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // auth
    AuthModule
  ],
  declarations: [
    I18NPipe,
    I18NNumPipe,
    I18NParsePipe,
    I18NDatePipe,
    I18NDateTimePipe,
    I18NTimestampPipe
  ],
  exports: [
    I18NPipe,
    I18NNumPipe,
    I18NParsePipe,
    I18NDatePipe,
    I18NDateTimePipe,
    I18NTimestampPipe,
  ]
})
export class I18nModule {
  static forRoot(config: I18NConfig): ModuleWithProviders {
    return {
      ngModule: I18nModule,
      providers: [
        { provide: I18NConfig, useValue: config },
        I18NService,
        /* next line loads the i18n configuration from server during bootstrap */
        { provide: APP_INITIALIZER, useFactory: load, deps: [HttpClient, I18NConfig, I18NService], multi: true }
      ]
    };
  }
}
