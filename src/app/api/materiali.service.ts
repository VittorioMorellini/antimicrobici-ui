import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClientService } from './client.service';
import { NamedEntity, Result } from './dto';
import { PaginatedFilter } from './filters';
import { mkPaginatedHttpParams, mkHttpParamsMap } from './utils';

@Injectable()
export class MaterialiService {

  constructor(private readonly client: ApiClientService) { }

  /**
   * Finds the records `Richiedente` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: PaginatedFilter): Observable<Result<NamedEntity>> {
    const params: HttpParams = mkPaginatedHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<Result<NamedEntity>>('materiali', opts);
  }

}
