import { Injectable, Optional } from '@angular/core';

declare function jwt_decode(token: string): any;

const TOKEN_KEY = 'auth-token';

/**
 * An ACL is a list of secured resources along with their permissions.
 */
export interface Acl { [secobjid: string]: number; }

/**
 * User profile obtained from JWT token.
 */
export class UserProfile {

  constructor(private raw: any) {
    this.raw._acl = UserProfile.uppercase(this.raw._acl);
  }

  static uppercase(acl) {
    const out = {};
    for (const key in acl) {
      if (acl.hasOwnProperty(key)) {
        out[key.toUpperCase()] = acl[key];
      }
    }
    return out;
  }

  get username(): string { return this.raw._u; }
  get firstName(): string { return this.raw._fn; }
  get lastName(): string { return this.raw._ln; }
  get email(): string { return this.raw._e; }
  get timezone(): string { return this.raw._tz; }
  get authType(): string { return this.raw._at; }
  get acl(): Acl { return this.raw._acl as Acl; }
  get firstLogin(): boolean { return this.raw._fl; }
  // TODO farsi dare la data di scandenza ed eventualmente la soglia in giorni x il warning!
  get passwordExpired(): boolean { return this.raw._pe; }
}

/**
 * Configuration class for authentication service.
 */
export class AuthServiceConfig {
  tokenKey?: string;
}

/**
 * The authentication service.
 */
@Injectable()
export class AuthService {
  private tokenKey = TOKEN_KEY;
  // tslint:disable-next-line: variable-name
  private _profile: UserProfile = null;

  constructor(@Optional() private config: AuthServiceConfig) {
    if (config) {
      if (config.tokenKey) {
        this.tokenKey = config.tokenKey;
      }
    }
  }

  /**
   * Retrieves the current JWT token or null if none was stored.
   */
  get token(): string {
    let token = sessionStorage.getItem(this.tokenKey);
    if (!token) {
      token = localStorage.getItem(this.tokenKey);
    }
    return token;
  }

  /**
   * Retrieves the current `UserProfile`.
   */
  get profile(): UserProfile {
    this.loadProfile();
    return this._profile;
  }

  /**
   * Tells whether user is currently logged in.
   */
  get isLoggedIn(): boolean {
    this.loadProfile();
    return !!this._profile;
  }

  private loadProfile() {
    if (this._profile) {
      return;
    }
    const t = this.token;
    if (t) {
      this._profile = this.mkUserProfile(t);
    }
    return;
  }

  /**
   * Removes any trace of tokens.
   */
  lockout() {
    this._profile = null;
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  /**
   * Saves a new token.
   *
   * @param token     The token
   * @param remember  If passed and it's true, token is saved in the local storage.
   */
  save(token: string, remember?: boolean) {
    if (remember) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
    }
    this._profile = this.mkUserProfile(token);
  }

  /**
   * Retrieves the user profile contained in the current authentication token.
   *
   * @param token JWT token
   * @return The user profile contained in the authentication token or null if no token is present.
   */
  private mkUserProfile(token: string): UserProfile {
    const profile: UserProfile = token ? new UserProfile(jwt_decode(token)) : null;
    return profile;
  }
}
