import {Pipe, PipeTransform} from '@angular/core';

const YES = 'Si';
const NO = 'No';

@Pipe({
  name: 'yesOrNo'
})
export class YesOrNoPipe implements PipeTransform {

  transform(value: boolean | number | string): string | null {
    if (typeof value === 'boolean') {
      return value ? YES : NO;
    }
    if (typeof value === 'number') {
      return value === 0 ? YES : NO;
    }
    if (typeof value === 'string') {
      switch (value.toLowerCase()) {
        case 'true':
        case 'yes':
        case 'y':
        case 'si':
          return YES;
        case 'false':
        case 'no':
        case 'n':
          return NO;
        default:
          return null;
      }
    }
    return null;
  }

}
