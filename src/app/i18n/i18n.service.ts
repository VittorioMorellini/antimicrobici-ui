import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
import 'moment-timezone';
// import { tz } from 'moment-timezone';
import { isBlank, format, isString } from '../commons/commons';

interface Localizations {
  language?: string;
  translations: { [x: string]: string; };
  formats: { [x: string]: string | number | boolean; };
}

export class I18NConfig {
  rootPath: string;
  localizations?: Localizations;
}

/**
 * Provides a function that when executed will load the localization
 * data and return true when finished.
 * Localization data is copied into the config class.
 *
 * @param  http   Angular Http service
 * @param  config I18N (partial configuration)
 * @return A function that loads the localization data
 */
export function load(http: HttpClient, config: I18NConfig, i18nService: I18NService): () => Promise<boolean> {
  return () => http
    .get(`${config.rootPath}/i18n`)
    .toPromise()
    .then(json => {
      config.localizations = json as Localizations;
      i18nService.init(config.localizations);
      return true;
    })
    .catch(err => {
      console.error('No way to get the localization data', err);
      config.localizations = { translations: {}, formats: {} };
      i18nService.init(config.localizations);
      return true;
    });
}

const NEW_LINES_RE = /\s*(\r\n|\n|\r)\s*/gm;
const SUFFIX_RE = /^((?:.|\s)+)__\{([-\w]+)\}$/;  // see https://regex101.com/r/bZ6iU3/2

/**
 * A service to perform translations and internationalizations of strings, numbers and dates.
 */
@Injectable()
export class I18NService {
  // tslint:disable: variable-name
  private _lang?: string;
  private _t: { [x: string]: string; };
  private _f: { [x: string]: string | number | boolean; };

  private static removeSuffix(text) {
    const matches = SUFFIX_RE.exec(text);
    return matches ? matches[1] : text;
  }

  constructor() {}

  init(localizations: Localizations) {
    this._lang = localizations.language;
    this._t = localizations.translations || {};
    this._f = localizations.formats || {};
    if (this._lang) {
      moment.locale(this._lang);
      moment.tz().locale(this._lang);
    }
  }

  /**
   * Translates a label.
   *
   * @param text  The input label, possibly including format placeholders and an
   *              optional suffix to better identify the context.
   *              Placeholders have the following format:
   *                {n} where n is a 0-based index of the value argument
   *              Suffix has the following format:
   *                __{letters} where letters are alpha-numeric characters
   * @param args  The remaining parameters are used in value substitution of placeholders
   * @returns The localized string, with placeholders substituted by input values eventually
   */
  translate(text: string, ...args: any[]) {
    const text2 = text.replace(NEW_LINES_RE, ' '); // sanity fix
    const trans = this._t[text2];
    const fmt = !isBlank(trans) ? trans : I18NService.removeSuffix(text2);
    return format(fmt, ...args);
  }

  /**
   * Retrieves the first day of the week supplied with the localization formats or the default one
   * if none was specified.
   *
   * @param defDay The default day of week
   * @returns The default day of the week
   */
  firstDay(defDay: number): number {
    const f: any = this._f['first-day'];
    return isFinite(f) ? (isString(f) ? parseInt(f, 10) : f) : defDay;
  }

  /**
   * Retrieves the short date formats supplied with the localization data or the default one if none
   * was specified.
   *
   * @param defFmt The default short date format.
   * @returns The short date format
   */
  dateShortFormat(defFmt) {
    const f: string = this._f['date-short'] as string;
    return !isBlank(f) ? f : defFmt;
  }

  /**
   * Retrieves the short date-time formats supplied with the localization data or the default one if none
   * was specified.
   *
   * @param defFmt The default short date-time format.
   * @returns The short date-time format
   */
  dateTimeShortFormat(defFmt) {
    const f: string = this._f['date-time-short'] as string;
    return !isBlank(f) ? f : defFmt;
  }

  /**
   * Retrieves the timestamp formats supplied with the localization data or the default one if none
   * was specified.
   *
   * @param defFmt The default timestamp format.
   * @returns The timestamp format
   */
  timestampFormat(defFmt) {
    const f: string = this._f.timestamp as string;
    return !isBlank(f) ? f : defFmt;
  }

  /**
   * Retrieves the decimal-separator, thousand-separator , ecc... supplied with the localization data or the default one if none
   * was specified.
   *
   * @param text The input format, possibly
   * @param args The remaining parameters are used in value substitution of placeholders
   * @returns The localized format, with placeholders substituted by input values eventually
   */
  getFormat(text: string, ...args: any[]) {
    const f: string = this._f[text] as string;
    return !isBlank(f) ? f : args[text];
  }
}
