import {Optional, Pipe, PipeTransform} from '@angular/core';
// import { tz } from 'moment-timezone';

import * as moment from 'moment';
import 'moment-timezone';
import {AuthService} from '../auth/auth.service';
import {I18NService} from './i18n.service';

const DEFAULT_FORMATS = {
  TIMESTAMP: 'll LTS',
  DATETIME: 'DD/MM/YY, LT',
  DATE: 'DD/MM/YY'
};

const DEFAULT_TIMEZONE = 'Europe/Rome';

@Pipe({name: 'i18n'})
export class I18NPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) {
  }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.translate(value, ...args);
  }

}

@Pipe({name: 'i18nNum'})
export class I18NNumPipe implements PipeTransform {

  constructor(private readonly i18nService: I18NService) {
  }

  transform(value: string, ...args: any[]): any {
    return this.i18nService.getFormat(value, ...args);
  }

}

@Pipe({name: 'i18nParse'})
export class I18NParsePipe implements PipeTransform {

  constructor() {}

  // value is assumed to be a string in ISO 8601 format
  transform(value: string): moment.Moment | null {
    return value ? moment(value) : null;
  }

}

@Pipe({name: 'i18nDate'})
export class I18NDatePipe implements PipeTransform {

  constructor(private readonly i18n: I18NService,
              @Optional() private readonly auth: AuthService) {
  }

  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault(this.auth);
    return value ? moment(value).tz(timeZone).format(this.i18n.dateShortFormat(DEFAULT_FORMATS.DATE)) : null;
  }

}

@Pipe({name: 'i18nDateTime'})
export class I18NDateTimePipe implements PipeTransform {

  constructor(private readonly i18n: I18NService,
              @Optional() private readonly auth: AuthService) {
  }

  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault(this.auth);
    return value ? moment(value).tz(timeZone).format(this.i18n.dateTimeShortFormat(DEFAULT_FORMATS.DATETIME)) : null;
  }

}

@Pipe({name: 'i18nTimestamp'})
export class I18NTimestampPipe implements PipeTransform {

  constructor(private readonly i18n: I18NService,
              @Optional() private readonly auth: AuthService) {
  }

  // value is assumed to be a valid `moment` object
  transform(value: Date | moment.Moment): string | null {
    const timeZone = timezoneOrDefault(this.auth);
    return value ? moment(value).tz(timeZone).format(this.i18n.timestampFormat(DEFAULT_FORMATS.TIMESTAMP)) : null;
  }

}

function timezoneOrDefault(auth?: AuthService) {
  return auth && auth.profile && auth.profile.timezone ? auth.profile.timezone : DEFAULT_TIMEZONE;
}
