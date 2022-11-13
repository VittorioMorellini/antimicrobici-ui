import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {ApiClientService} from './client.service';
import {Result, NamedEntity} from './dto';
import {PaginatedFilter} from './filters';
import {mkPaginatedHttpParams} from './utils';

@Injectable()
export class PrioritaService {

  constructor(private readonly client: ApiClientService) {}

  /**
   * Finds the records `Priorita` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: PaginatedFilter): Observable<Result<NamedEntity>> {
    const params: HttpParams = mkPaginatedHttpParams(filter);
    const opts = params ? {params} : {};
    return this.client.get<Result<NamedEntity>>('prioritas', opts);
  }
}
