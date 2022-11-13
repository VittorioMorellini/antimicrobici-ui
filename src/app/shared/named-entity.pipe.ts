import {Pipe, PipeTransform} from '@angular/core';
import {NamedEntity} from '../api/dto';
import {isBlank} from '../commons/commons';

@Pipe({
  name: 'namedEntity'
})
export class NamedEntityPipe implements PipeTransform {

  transform(entity: NamedEntity): string {
    if (!entity) {
      return '';
    }

    const text: string[] = [];
    if (!isBlank(entity.nome)) {
      text.push(entity.nome);
      if (!isBlank(entity.codice)) {
        text.push(`(${entity.codice})`);
      }
    } else if (!isBlank(entity.codice)) {
      text.push(entity.codice);
    }
    return text.join(' ');
  }

}
