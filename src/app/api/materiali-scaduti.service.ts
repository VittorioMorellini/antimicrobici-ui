import { HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { ApiClientService } from './client.service';
import { NamedEntity, MatScaduto, Result as IResult, MatScadutoRecord } from './dto';
import { PaginatedFilter, MatScadutoFilter, RichiestaFilter } from './filters';
import { mkPaginatedHttpParams, mkHttpParamsMap, Result, fixMatScadutoDates } from './utils';
import * as moment from "moment";
import { map, catchError } from 'rxjs/operators';

function matScadutoHttpParams(filter?: MatScadutoFilter): HttpParams {
  const fromObject: any = mkHttpParamsMap(filter);
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
export class MaterialiScadutiService {

  constructor(private readonly client: ApiClientService) { }

  /**
   * Finds the records `Richiedente` according to optional filter.
   * @param filter The filter.
   */
  find(filter?: MatScadutoFilter): Observable<IResult<MatScaduto>> {
    const params: HttpParams = matScadutoHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<IResult<MatScaduto>>('materialiscaduti', opts)
      .pipe(map(res => new Result(res.total, res.results, null).map(fixMatScadutoDates)));
  }

  delete(row?: MatScaduto): Observable<void> {
    /* create */
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    const id: number = row.id;
    // DEBUG
    console.log('Id to delete: ' + id);
    return this.client
      .delete<void>("materialiscaduti/" + id)
      .pipe(catchError(error => this.handleError(error)));
  }

  addRecord(item: MatScadutoRecord): Observable<MatScadutoRecord> {
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
      .post<MatScadutoRecord>("materialiscaduti", item)
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

  public DownloadExcel(filter?: MatScadutoFilter): Observable<ArrayBuffer> {
    // let blob = new Blob(new ArrayBuffer());
    // "application/octet-stream"
    // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // console.log("sono in api download excel di listeattesa service");
    const parameter: HttpParams = matScadutoHttpParams(filter);
    return this.client.get<ArrayBuffer>("materialiscaduti/excel", {
      // responseType: "arraybuffer",
      responseType: "arraybuffer",
      headers: new HttpHeaders({
        "Content-Type": "application/octet-stream",
      }),
      params: parameter,
    });
  }
}
