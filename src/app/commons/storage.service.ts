import { Injectable } from '@angular/core';

/**
 * Service which takes care of storing data in local session.
 */
@Injectable()
export class StorageService {

  constructor() { }

  store(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to session storage', e);
    }
  }

  load(key: string): any {
    try {
      const value = sessionStorage.getItem(key);
      return value === null ? null : JSON.parse(value);
    } catch (e) {
      console.error('Error getting data from session storage', e);
      return null;
    }
  }
}
