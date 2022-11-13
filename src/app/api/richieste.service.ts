import { HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { ApiClientService } from "./client.service";
import { RichiestaRecord, Result as IResult, Richiesta } from "./dto";
import { RichiestaFilter } from "./filters";
import { fixRichiestaRecordDates, mkHttpParamsMap, Result } from "./utils";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { error } from "util";
import * as moment from "moment";

function richiestaHttpParams(filter?: RichiestaFilter): HttpParams {
  const fromObject: any = mkHttpParamsMap(filter);
  if (filter && filter.codiceRichiedente) {
    fromObject.codiceRichiedente = filter.codiceRichiedente;
  }
  if (filter && filter.codiceMateriale) {
    fromObject.codiceMateriale = filter.codiceMateriale;
  }
  if (filter && filter.medico) {
    fromObject.medico = filter.medico;
  }
  if (filter && filter.isInfettivologo) {
    fromObject.isInfettivologo = filter.isInfettivologo;
  }
  if (filter && filter.motivazione) {
    fromObject.motivazione = filter.motivazione;
  }
  if (filter && filter.destinatario) {
    fromObject.destinatario = filter.destinatario;
  }
  if (filter && filter.stato) {
    fromObject.stato = filter.stato;
  }
  if (filter && filter.statoMedico) {
    fromObject.statoMedico = filter.statoMedico;
  }
  if (filter && filter.dataDa) {
    fromObject.dataDa = moment(filter.dataDa).format('YYYY-MM-DD');
  }
  if (filter && filter.dataA) {
    fromObject.dataA = moment(filter.dataA).format("YYYY-MM-DD");
  }
  return new HttpParams({ fromObject });
}

@Injectable()
export class RichiesteService {
  constructor(
    private readonly client: ApiClientService,
    private httpClient: HttpClient
  ) { }

  /**
   * Finds the records `RichiestaRecord` according to optional filter.
   * @param filter The filter
   * @returns A series of filtered results along with their aggregation counts
   */
  find(filter?: RichiestaFilter): Observable<IResult<RichiestaRecord>> {
    const params: HttpParams = richiestaHttpParams(filter);
    const opts = params ? { params } : {};
    return this.client.get<IResult<RichiestaRecord>>("richieste", opts).pipe(
      map((res) => {
        const ires = new Result(res.total, res.results, res.alert).map(
          fixRichiestaRecordDates
        );
        return ires;
      })
    );
  }

  /**
   * Loads a full `RichiestaRecord` with the specified `id` identifier.
   * @param id The identifier
   * @returns An `Observable` of `RichiestaRecord`.
   */
  load(id: string): Observable<RichiestaRecord> {
    console.log("Sono nel load");
    return this.client
      .get<RichiestaRecord>(`richieste/${encodeURIComponent(id)}`)
      .pipe(map(fixRichiestaRecordDates));
  }

  addRecord(richiesta?: RichiestaRecord): Observable<Richiesta> {
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
      .post<Richiesta>("richieste", richiesta)
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

  public DownloadExcel(filter?: RichiestaFilter): Observable<ArrayBuffer> {
    // let blob = new Blob(new ArrayBuffer());
    // "application/octet-stream"
    // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // console.log("sono in api download excel di listeattesa service");
    const parameter: HttpParams = richiestaHttpParams(filter);
    return this.client.get<ArrayBuffer>("richieste/excel", {
      // responseType: "arraybuffer",
      responseType: "arraybuffer",
      headers: new HttpHeaders({
        "Content-Type": "application/octet-stream",
      }),
      params: parameter,
    });
  }
}
