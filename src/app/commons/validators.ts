// useful validation functions

import { ValidationErrors, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { isDefined } from './commons';

/**
 * Validates the value of a controller, expects it to be an integer.
 * @param ctrl The controller to be validated
 * @returns Null if controller is valid, a proper error code otherwise.
 */
export function validateInteger(ctrl: AbstractControl): ValidationErrors {
  const v = ctrl.value;
  if (v === null || typeof v === 'undefined') {
    return null;
  }

  if (_.isSafeInteger(v)) {
    return null;
  }

  if (_.isString(v)) {
    try {
      const n = Number(v);
      if (_.isSafeInteger(n)) {
        return null;
      }
    } catch (e) {}
  }

  return { not_a_integer: true };
}

/**
 * Validates the value of a controller, expects it to be a float number.
 * @param ctrl The controller to be validated
 * @returns Null if controller is valid, a proper error code otherwise.
 */
export function validateFloat(ctrl: AbstractControl): ValidationErrors {
  const v = ctrl.value;

  if (v === null || typeof v === 'undefined') {
    return null;
  }

  if (_.isNumber(v)) {
    return null;
  }

  if (_.isString(v)) {
    try {
      const n = Number(v);
      if (_.isFinite(n)) {
        return null;
      }
    } catch (e) {}
  }

  return { not_a_float: true };
}

/**
 * Validates the value of a controller, expects it to be the right object for the
 * NgBootstrao date picker component.
 * @param ctrl The controller to be validated
 * @returns Null if controller is valid, a proper error code otherwise.
 */
export function validateNgbDate(ctrl: AbstractControl): ValidationErrors {
  const v = ctrl.value;

  if (!v || !v.year || !v.month || !v.day) {
    return { not_a_date: true };
  }

  return null;
}

/**
 * Validates two controllers at a time, expects the value of the first to be greater than
 * or equal to the value of the second.
 * @param src The source controller
 * @param tgt The target controller
 * @param prefix Error prefix
 * @param suffix Error suffix
 * @returns Null if controller is valid, a proper error code otherwise.
 */
export function greaterThanOrEqualTo(src: AbstractControl, tgt: AbstractControl, prefix?: string, suffix?: string): ValidationErrors {
  const s = src.value;
  const t = tgt.value;

  if (_.isNumber(s) && _.isNumber(t) && s < t) {
    const err = {};
    const code = `${isDefined(prefix) ? prefix + '_' : ''}not_gt_or_eq${isDefined(suffix) ? '_' + suffix : ''}`;
    err[code] = true;
    return err;
  }

  return null;
}

/**
 * Creates a validator that checks if the controller value is strictly greater than the given
 * lower bound.
 * @param min The lower bound value
 * @returns The validator function
 */
export function validateGt(min: number): (ctrl: AbstractControl) => ValidationErrors {
  return ctrl => {
    const v = ctrl.value;

    if (_.isNumber(v) && v <= min) {
      return { not_gt: true };
    }

    return null;
  };
}

/**
 * Validates two controllers at a time, expects they have equal values.
 * @param src The source controller
 * @param tgt The target controller
 * @returns Null if controller is valid, a proper error code otherwise.
 */
export function validateEq(src: AbstractControl, tgt: AbstractControl): ValidationErrors {
  const s = src.value;
  const t = tgt.value;

  if (s !== t) {
    return { not_eq: true };
  }

  return null;
}
