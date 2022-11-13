import {InjectionToken} from '@angular/core';

export class AppConfig {
  commons: {
    name: string,
    version: string,
  };
  api: {
    rootPath: string;
  };
  auth: {
    authService: {
      tokenKey?: string;
    };
    lockout: {
      loginRoute?: string;
      forbiddenRoute?: string;
    };
  };
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('app.config');

export const ROOT_PATH = '../api';

export const APP_CONFIG: AppConfig = {
  commons: {name: 'Antimicrobial Stewardship', version: '1.0.0'},
  api: {rootPath: ROOT_PATH},
  auth: {
    authService: {tokenKey: 'app.token'},
    lockout: {loginRoute: '', forbiddenRoute: '/f/forbidden'}
  }
};
