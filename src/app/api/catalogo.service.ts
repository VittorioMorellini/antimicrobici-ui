import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiClientService } from "./client.service";
import { NamedEntity, Result, MatScadutoCatalogo } from "./dto";
import { PaginatedFilter, MatScadutoFilter } from "./filters";
import { mkPaginatedHttpParams, mkHttpParamsMap } from "./utils";

function mkMaterialiHttpParams(filter?: string): HttpParams {
  const myFilter: MatScadutoFilter = { nomeMateriale: filter };

  const fromObject: any = mkHttpParamsMap(myFilter);
  if (myFilter && myFilter.nomeMateriale) {
    fromObject.nomeMateriale = myFilter.nomeMateriale;
  }
  return new HttpParams({ fromObject });
}

@Injectable()
export class CatalogoService {
  constructor(private readonly client: ApiClientService) {}

  /**
   * Finds the records `Richiedente` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: PaginatedFilter): Observable<Result<MatScadutoCatalogo>> {
    const params: HttpParams = mkPaginatedHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<Result<MatScadutoCatalogo>>("catalogo", opts);
  }

  search(value: string): Observable<Result<MatScadutoCatalogo>> {
    const params: HttpParams = mkMaterialiHttpParams(value);
    const opts = params ? { params } : {};
    return this.client.get<Result<MatScadutoCatalogo>>(
      "catalogo/nome",
      opts
    );
  }
}
