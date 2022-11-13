import * as _ from 'lodash';
import * as moment from 'moment';

const DATE_RANGE_SEP = '- ';
const LIST_SEP = '|';
const PAIR_SEP = '@';

/**
 * A range of two dates.
 */
export class DateRange {

  static empty() {
    return new DateRange(null, null);
  }

  /**
   * Parses a range of dates.
   * Dates must be specified as '{from}-{to}' where from and to are expressed as
   * milliseconds since the Epoch time and are separated with a dash.
   *
   * @param val         The string value
   * @param useFallback Optional, if true an empty object is returned instead of null
   * @return A date range
   */
  static parse(val: string, useFallback: boolean) {
    if (!isString(val) || isBlank(val)) {
      return useFallback ? DateRange.empty() : null;
    }

    const i = val.indexOf(DATE_RANGE_SEP);
    const startVal = val.substr(0, i);
    const endVal = val.substr(i + 1);
    const startDate = new Date(parseInt(startVal, 10));
    const endDate = new Date(parseInt(endVal, 10));

    // if i was in a valid range, return the date range, otherwise null or fallback
    return i > 0 && i < val.length - 1 ?
      new DateRange(startDate, endDate) :
      (useFallback ? DateRange.empty() : null);
  }

  /**
   * Formats two dates of a range with the format '{from}-{to}' where from and to
   * are expressed as milliseconds since the Epoch time and are separated with a dash.
   */
  static format(start: Date, end: Date) {
    return start.getTime() + DATE_RANGE_SEP + end.getTime();
  }

  constructor(readonly startDate: Date, readonly endDate: Date) {
  }
}

/**
 * A pair of values.
 */
export class Pair<T, S> {

  /**
   * Parses a pair of values separated by '@'.
   *
   * @param val The string to be parsed
   * @return A pair of strings
   */
  static parse(val: string): Pair<string, string> {
    const idAndName = val.split(PAIR_SEP);
    const tag = new Pair(idAndName[0], idAndName[1]);
    return idAndName.length === 2 ? tag : null;
  }

  /**
   * Parses a string which was made up of the concatenation of pairs.
   *
   * @param val A string
   * @param dflt Any default value
   * @returns An array of pairs
   */
  static parsePairs(val: string, dflt: any): Pair<string, string>[] | any {
    if (!isString(val) || isBlank(val)) {
      return dflt || null;
    }

    const tokens = val.split(LIST_SEP);
    const pairs = _(tokens)
      .filter(v => !isBlank(v) && v.indexOf(PAIR_SEP) !== -1)
      .map(v => Pair.parse(v))
      .filter(p => p !== null)
      .value();

    return pairs;
  }

  /**
   * Formats a list of pairs.
   *
   * @param pairs An array of pairs
   * @returns A string made up of the concatenation of the pairs
   */
  static format(pairs): string {
    return _(pairs).map(p => p.first + PAIR_SEP + p.second).join(LIST_SEP);
  }

  constructor(readonly first: T, readonly second: S) {
  }
}

/**
 * A function that always returns true.
 *
 * @return Always true
 */
export function alwaysTrue() {
  return true;
}

/**
 * The identity function.
 *
 * @param x Any value
 * @returns The same input vlaue
 */
export function identity<T>(x: T): T {
  return x;
}

/**
 * Creates a function that emits sequences of numbers when invoked.
 *
 * @param  base The base of the sequence, default is 1
 * @return A function that generates sequence numbers
 */
export function sequence(base = 1): () => number {
  let no = base;
  return () => no++;
}

export function isDefined(val: any): boolean {
  return val !== null && (typeof val !== 'undefined');
}

export function isBlank(val: string): boolean {
  return !isDefined(val) || val.length === 0 || /^\s*$/.test(val);
}

export function isNumber(n: any): boolean {
  return n !== null && (typeof n === 'number' || n instanceof Number);
}

export function isString(s: any): boolean {
  return s && (typeof s === 'string' || s instanceof String);
}

export function hasElements(a) {
  return a && _.isArray(a) && a.length !== 0;
}

/**
 * Formats a string using the placeholders {n}.
 *
 * @param fmt   The format string
 * @param args  Additional parameters
 * @returns The formatted string
 */
export function format(fmt: string, ...args: any[]): string {
  return fmt.replace(/\{(\d+)\}/g, function _f(match, capture) {
    const val = args[parseInt(capture, 10)];
    return val !== undefined ? val : match;
  });
}

export function formatList(list) {
  return list.join(LIST_SEP);
}

export function parseList(val: string, dflt): string[] {
  if (!isString(val) || isBlank(val)) {
    return dflt || null;
  }
  return val.split(LIST_SEP);
}

export function toId(v: any): any {
  return v.id;
}

export function hasSameId(val: any): (t: any) => boolean {
  return t => t.id === val.id;
}

export function tagSize(tag): number {
  // tslint:disable-next-line: one-variable-per-declaration no-bitwise
  const s = ~~(tag.weigth * 10) + 1,
    size = s > 10 ? 10 : s;
  return size;
}

export function splitDateTime(dt, noTime): { date: string, time: string } {
  const m = moment(dt);
  const time = noTime ? null : m.format('HH:mm');
  return {
    date: m.format(),
    time
  };
}

/**
 * Simplifies the call of scoped attributes that reference functions.
 *
 * @param functor A functor function
 * @return True if the functor is really a functor, false otherwise.
 */
export function callIfFunctor(functor: any): boolean {
  if (_.isFunction(functor)) {
    const fn = functor();
    if (_.isFunction(fn)) {
      const args = _.toArray(arguments).slice(1);
      fn.apply(null, args);
      return true;
    }
  }
  return false;
}

/**
 * Use this function to customize the deep cloning of any object that might use
 * Moment values for dates and times.
 *
 * @param val Any value, likely a moment object
 * @returns Undefined if val is not a Moment instance, otherwise a cloned copy of the Moment value.
 */
export function cloneMoment(val) {
  if (moment.isMoment(val)) {
    return moment(val);
  }
}

/**
 * Updates or inserts a value in an array, according to the matching predicate function.
 *
 * @param arr   The array of values
 * @param pred  The predicate function, executed on the elements of the array
 * @param val   Any value to be inserted or substituted
 * @returns The index of element being updated or -1 if element was not found (and it was appended)
 */
export function upsert<T>(arr: T[], pred, val: T) {
  const i = _.findIndex(arr, pred);
  if (i >= 0) {
    arr.splice(i, 1, val);
  } else {
    arr.push(val);
  }
  return i;
}

/**
 * Finds an element that satisfies one of the selectors
 *
 * @param elem A jQuery element
 * @param sels Other arguments are expected to be selector strings
 * @returns True if element is found
 */
export function findFirst(elem: any, ...sels: string[]): any {
  let match;

  for (let i = 0; i < sels.length && (!match || !match.length); i++) {
    match = elem.find(sels[i]);
  }

  return match && match.length ? match.first() : null;
}

/**
 * Executes the given value if it's a function or simply returns it if it's not.
 *
 * @param val Any value, can be a function
 * @return The returned value of the execution of val if it's a function, val itself otherwise.
 */
export function execOrGet(val: any | (() => any)): any {
  return _.isFunction(val) ? val() : val;
}

/**
 * Finds a value within an array of values given the corresponding 'id' property.
 *
 * @param id      The identifier
 * @param values  Objects with integer 'id' property
 * @returns The first value in values whose 'id' property equals the numeric
 * representation of the input id parameter.
 */
export function findByIntegerId(id: any, values: { id: any }[]) {
  if (id === null || id === null) {
    return null;
  }
  const lid = parseInt(id, 10);
  return _.find(values, (v: { id: any }) => v.id === id || v.id === lid);
}

/**
 * Creates a function that searches for a text into any value that is possibly transformed
 * by the specified selector.
 *
 * @param match A text to be looked up into any value that is possibly transformed by selector
 * @param selector A function that takes any value in input and returns an array of string elements
 * @returns A function that searches for a text
 */
export function matches(match: string, selector: (v: any) => string[]): (v: any) => boolean {
  const needle = match.toLowerCase();
  return (val: any) => {
    const texts = selector(val);
    return _.some(texts, t => {
      const haystack = t ? t.toLowerCase() : '';
      return haystack.indexOf(needle) >= 0;
    });
  };
}

/**
 * A constructor of a function that return true if the passed value is in the specified keyset.
 *
 * @param keyset A set of keys
 * @returns A function that tells whether an element is in the set
 */
export function ifNotIn(keyset): (_: { id: string | number }) => boolean {
  return (val: { id: string | number }) => !(val.id in keyset);
}

/**
 * A constructor of a function that return true if the passed value is NOT in the specified keyset.
 *
 * @param keyset The set of keys
 * @returns A function that tells whether
 */
export function ifIn(keyset): (_: { id: string | number }) => boolean {
  return (val: { id: string | number }) => val.id in keyset;
}

/**
 * A constructor of a function that return true if calling the passed function returns false.
 * <p>
 * Returns the negated function.
 * </p>
 *
 * @param fn A function that takes a value in input and returns a boolean
 * @returns A negated function
 */
export function negate(fn: (_: any) => boolean): (_: any) => boolean {
  return val => !fn(val);
}

/**
 * Converts an array of primitive values into a set.
 *
 * @param arr Array of primitive values that can be converted into keys.
 * @return A set with the array values as keys.
 */
export function arrayToSet(arr: any[]): { [x: string]: true } {
  const s = {};
  _.forEach(arr, (v: any) => s[v.toString()] = true);
  return s;
}

/**
 * Paginates an array of values.
 *
 * @param arr   Any array of values
 * @param page  1-based page number
 * @param size  Number of elements to return
 * @returns A view of the given array at the specified page and with the specified number of elements
 */
export function paginate(arr: any[], page: number, size: number) {
  // page is 1-based
  // first index is (page-1)*size
  const i = (page - 1) * size;
  const j = i + size;
  return arr.slice(i, j);
}

/**
 * Returns a function that will execute the specified function with no arguments.
 *
 * @param func Any function
 * @returns A function that wraps the given function and passes no arguments to it
 */
export function noArgs(func: (...args: any[]) => any): () => any {
  return () => func();
}

/**
 * Returns the week day label.
 * Week day is a number ranging 0 to 6 where 0 corresponds to monday and 6 to sunday.
 * Moment follows a different convention: 0 corresponds to sunday and 6 to saturday.
 *
 * @param n The day number (0-based)
 * @returns The day label
 */
export function weekDay(n: number): string {
  return moment().day((n + 1) % 7).format('dddd');
}

/**
 * Removes a character from the head of a string.
 *
 * @param  str  The target string
 * @param  char The single character
 * @return      The beheaded string
 */
export function behead(str: string, char: string): string {
  let s = str;
  while (s && s[0] === char) {
    s = s.slice(1);
  }
  return s;
}

/**
 * Removes a character from the tail of a string.
 *
 * @param  str  The target string
 * @param  char The single character
 * @return      The modified string
 */
export function untail(str: string, char: string): string {
  let s = str;
  while (s && s[s.length - 1] === char) {
    s = s.substr(0, s.length - 1);
  }
  return s;
}

/**
 * Performs a binary search on the provided sorted list and returns the index of the item if found.
 * If it can't be found it'll return -1.
 *
 * @param list Items to search through.
 * @param item The item to look for.
 * @return The index of the item if found, -1 if not.
 * @see https://oli.me.uk/2014/12/17/revisiting-searching-javascript-arrays-with-a-binary-search/
 */
export function binarySearch(list: string[] | number[], item: string | number) {
  let min = 0;
  let max = list.length - 1;
  let guess;
  const bitwise = max <= 2147483647;

  if (bitwise) {
    while (min <= max) {
      // tslint:disable-next-line: no-bitwise
      guess = (min + max) >> 1;
      if (list[guess] === item) {
        return guess;
      } else {
        if (list[guess] < item) {
          min = guess + 1;
        } else {
          max = guess - 1;
        }
      }
    }
  } else {
    while (min <= max) {
      guess = Math.floor((min + max) / 2);
      if (list[guess] === item) {
        return guess;
      } else {
        if (list[guess] < item) {
          min = guess + 1;
        } else {
          max = guess - 1;
        }
      }
    }
  }

  return -1;
}

/**
 * Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given
 * length. Credits to Mozilla:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 *
 * @param targetLength  The length of the resulting string once the current string has been padded.
 *                      If the value is less than the current string's length, the current string is returned as is.
 * @param padString The string to pad the current string with. If this padding string is too long to stay within the
 *                  `targetLength`, it will be truncated from the right. The default value is " " (U+0020 'SPACE').
 * @returns A padded string
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
 */
function padStart(targetLength, padString): string {
  // tslint:disable-next-line:no-bitwise
  targetLength = targetLength >> 0; // truncate if number, or convert non-number to 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (this.length >= targetLength) {
    return String(this);
  } else {
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer
                                                                      // than needed
    }
    return padString.slice(0, targetLength) + String(this);
  }
}

/**
 * Pads the given number with zeroes on the left side.
 * @param n   The number
 * @param len The minimum length of the final string
 * @returns A padded string
 */
export function padl(n: number, len: number): string {
  return Reflect.apply(padStart, n.toString(10), [len, 0]);
}

export function drill(root: any, path: string, sep: string = '.'): any {
  if (isBlank(path)) {
    return root;
  }
  return path.split(sep).reduce((obj, prop) => obj[prop], root);
}

/**
 * Flattens the branches of a tree.
 * @param tree An array of tree nodes
 * @param desc A descendent selector
 * @returns An array of strings built by a recursive visit of the objects in the array.
 */
export function branches<T>(tree: T[], desc: (x: T) => T[]): T[][] {

  function dive(acc: T[], data: T): T[] {
    const children = desc(data);
    if (children.length === 0) {
      return [...acc, data];
    }

    return _.flatMap(children, c => dive([...acc, data], c));
  }

  return tree.map(c => dive([], c));
}

/**
 * Flattens the branches of a tree.
 * @param tree  An array of tree nodes
 * @param desc  A descendent selector
 * @param trans Transformation operator that is applied to complete branches once they are ready
 * @returns An array of strings built by a recursive visit of the objects in the array.
 */
export function transformBranches<T, R>(tree: T[], desc: (x: T) => T[], trans: (ts: T[]) => R): R[] {

  function dive(acc: T[], data: T): R[] {
    const children = desc(data);
    if (children.length === 0) {
      return [trans([...acc, data])];
    }

    return _.flatMap(children, c => dive([...acc, data], c));
  }

  return _.flatMap(tree, c => dive([], c));
}
