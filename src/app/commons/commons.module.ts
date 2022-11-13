// angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// commons
import { CommonsConfig } from './commons.config';
import { FullnamePipe, AsIdPipe, AsClassPipe, MapToArrayPipe } from './commons.pipe';
import {
  ApplicationVersionDirective,
  ApplicationNameDirective,
  FromYearDirective,
  BusyDirective,
  MimeIconDirective,
  DisableControlDirective
} from './commons.directive';
import { BusyService } from './busy.service';
import { StorageService } from './storage.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    MapToArrayPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective,
    FromYearDirective,
    BusyDirective,
    MimeIconDirective,
    DisableControlDirective
  ],
  exports: [
    FullnamePipe,
    AsIdPipe,
    AsClassPipe,
    MapToArrayPipe,
    ApplicationVersionDirective,
    ApplicationNameDirective,
    FromYearDirective,
    BusyDirective,
    MimeIconDirective,
    DisableControlDirective
  ]
})
export class CommonsModule {

  /**
   * Configures the CommonsModule.
   *
   * @param config Module configuration
   * @return The module with the providers
   */
  static forRoot(config: CommonsConfig): ModuleWithProviders {
    return {
      ngModule: CommonsModule,
      providers: [
        { provide: CommonsConfig, useValue: config },
        // services
        BusyService,
        StorageService
      ]
    };
  }
}
