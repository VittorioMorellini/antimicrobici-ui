import { HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { ApiClientService } from './client.service';
import { NamedEntity, MatScaduto, Result as IResult } from './dto';
import { PaginatedFilter, MatScadutoFilter } from './filters';
import { mkPaginatedHttpParams, mkHttpParamsMap, Result, fixMatScadutoDates } from './utils';
import * as moment from "moment";
import { map, catchError } from 'rxjs/operators';

function matScadutoHttpParams(filter?: MatScadutoFilter): HttpParams {
  const fromObject: any = mkHttpParamsMap(filter);
  if (filter && filter.unitaOperativa) {
    fromObject.unitaOperativa = filter.unitaOperativa;
  }
  if (filter && filter.codiceRichiedente) {
    fromObject.codiceRichiedente = filter.codiceRichiedente;
  }
  if (filter && filter.materiale) {
    fromObject.materiale = filter.materiale;
  }
  if (filter && filter.stato) {
    fromObject.stato = filter.stato;
  }
  if (filter && filter.tipo) {
    fromObject.tipo = filter.tipo;
  }
  if (filter && filter.cdc) {
    fromObject.cdc = filter.cdc;
  }
  if (filter && filter.dataDa) {
    fromObject.dataDa = moment(filter.dataDa).format("YYYY-MM-DD");
  }
  if (filter && filter.dataA) {
    fromObject.dataA = moment(filter.dataA).format("YYYY-MM-DD");
  }
  return new HttpParams({ fromObject });
}

@Injectable()
export class RegistroMaterialiScadutiService {

  constructor(private readonly client: ApiClientService) { }

  /**
   * Finds the records `Richiedente` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: MatScadutoFilter): Observable<IResult<MatScaduto>> {
    const params: HttpParams = matScadutoHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<IResult<MatScaduto>>('registro', opts)
      .pipe(map(res => new Result(res.total, res.results, null).map(fixMatScadutoDates)));
  }


  saveRecord(row?: MatScaduto): Observable<MatScaduto> {
    /* create */
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    // PROD Ferrara
    // return this.httpClient.post<RichiestaRecord>('http://rack13new:81/antimBE/api/richieste', JSON.stringify(richiesta), httpOptions)
    // DEBUG
    return this.client
      .post<MatScaduto>("registro", row)
      .pipe(catchError(this.handleError));
  }

  handleError(errore: HttpErrorResponse) {
    let errorMessage = "";
    if (errore.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${errore.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${errore.status}\nMessage: ${errore.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
