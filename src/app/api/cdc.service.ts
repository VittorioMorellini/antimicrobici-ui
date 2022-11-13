import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiClientService } from "./client.service";
import { NamedEntity, Result, CentroDiCosto } from "./dto";
import { PaginatedFilter, MatScadutoFilter } from "./filters";
import { mkPaginatedHttpParams, mkHttpParamsMap } from "./utils";

function mkCdcHttpParams(filter?: string): HttpParams {
  const myFilter: MatScadutoFilter = { nomeMateriale: filter };

  const fromObject: any = mkHttpParamsMap(myFilter);
  if (myFilter && myFilter.nomeMateriale) {
    fromObject.nomeMateriale = myFilter.nomeMateriale;
  }
  return new HttpParams({ fromObject });
}

@Injectable()
export class CdcService {
  constructor(private readonly client: ApiClientService) {}
  /**
   * Finds the records `Richiedente` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: PaginatedFilter): Observable<Result<CentroDiCosto>> {
    const params: HttpParams = mkPaginatedHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<Result<CentroDiCosto>>("cdc", opts);
  }

  search(value: string): Observable<Result<CentroDiCosto>> {
    const params: HttpParams = mkCdcHttpParams(value);
    const opts = params ? { params } : {};
    return this.client.get<Result<CentroDiCosto>>("cdc/nome", opts);
  }
}
