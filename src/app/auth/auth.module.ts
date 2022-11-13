// angular
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// auth
import { AuthServiceConfig, AuthService } from './auth.service';
import { LockoutConfig, LockoutService } from './lockout.service';
import { AuthGuard } from './auth.guard';
import { PasswordExpiredGuard } from './password-expired.guard';
import { FirstLoginGuard } from './first-login.guard';
import { ApprovedGuard } from './approved.guard';

export class AuthConfig {
  authService: AuthServiceConfig;
  lockout: LockoutConfig;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthModule {
  static forRoot(config: AuthConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        // config values
        { provide: AuthServiceConfig, useValue: config.authService },
        { provide: LockoutConfig, useValue: config.lockout },
        // services
        AuthService,
        LockoutService,
        // guards
        AuthGuard,
        PasswordExpiredGuard,
        FirstLoginGuard,
        ApprovedGuard
      ]
    };
  }
}
