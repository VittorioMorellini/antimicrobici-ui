import { HttpParams } from '@angular/common/http';
import { Sort, SortDirection } from '@angular/material';
import * as moment from 'moment';
import {
  AggregationKey,
  Assistito,
  RichiestaRecord,
  Result as IResult,
  WithAggregations,
  MatScaduto
} from './dto';
import { PaginatedFilter, SortingDir, SortingFilter } from './filters';
import { ListKeyManager } from '@angular/cdk/a11y';


export class Result<T> implements IResult<T> {
  constructor(public readonly total: number,
    public readonly results: T[],
    public readonly alert: boolean) { }

  map<S>(fun: (t: T) => S): IResult<S> {
    return new Result(this.total, this.results.map(fun), this.alert);
  }
}

const ISO_8601_DATE = 'YYYY-MM-DD';
const ISO_8601_DATETIME = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/**
 * Converts a string that represents a date in ISO8601 format into a Date object.
 * @param d The string representing the date.
 * @returns The date object
 */
export function dtoToDate(d: Date | string | null): Date | null {
  if (typeof d === 'string') {
    const m = moment(d, ISO_8601_DATE);
    if (m.isValid()) {
      return m.toDate();
    }
    console.error('Cannot convert date from ISO8601 format', { date: d });
    return null;
  }
  return d;
}

export function dtoToDateNew(d: Date | string | null): Date | null {
  if (typeof d === 'string') {
    const m = moment(d, 'YY-MM-DD');
    if (m.isValid()) {
      return m.toDate();
    }
    console.error('Cannot convert date from ISO8601 format', { date: d });
    return null;
  }
  return d;
}

/**
 * Converts a string that represents a date and time in ISO8601 format into a Date object.
 * @param d The string representing the date.
 * @returns The date object
 */
export function dtoToDateTime(d: Date | string | null): Date | null {
  if (typeof d === 'string') {
    const m = moment(d, ISO_8601_DATETIME);
    if (m.isValid()) {
      return m.toDate();
    }
    console.error('Cannot convert date from ISO8601 format', { date: d });
    return null;
  }
  return d;
}

export function fixAssistitoDates(ass: Assistito): Assistito {
  return {
    codice: ass.codice,
    nome: ass.nome,
    cognome: ass.cognome,
    dataNascita: dtoToDate(ass.dataNascita),
    residenza: ass.residenza
  };
}

export function fixRichiestaRecordDates(lar: RichiestaRecord): RichiestaRecord {
  return {
    nrImpegno: lar.nrImpegno,
    quantita: lar.quantita,
    stato: lar.stato,
    tipoImpegno: lar.tipoImpegno,
    cdcRichiedente: lar.cdcRichiedente,
    qtaRichiesta: lar.qtaRichiesta,
    codiceMateriale: lar.codiceMateriale,
    dataErogazione: dtoToDate(lar.dataErogazione),
    dataCreazioneImpegno: dtoToDate(lar.dataCreazioneImpegno),
    inserimentoData: dtoToDate(lar.inserimentoData),
    descrizioneMateriale: lar.descrizioneMateriale,
    medicoRichiedente: lar.medicoRichiedente,
    destinatarioPazienteDettaglio: lar.destinatarioPazienteDettaglio,
    motivazione: lar.motivazione,
    classIcon: lar.classIcon,
    classIconMedico: lar.classIconMedico,
    note: lar.note,
    noteMedico: lar.noteMedico,
    medicoUO: lar.medicoUO,
    antibiogramma: lar.antibiogramma,
    consulenzaInfettivologica: lar.consulenzaInfettivologica,
    modificaDataMedico: dtoToDate(lar.modificaDataMedico),
    modificaUtenteMedico: lar.modificaUtenteMedico,
    posologia: lar.posologia,
    offLabel: lar.offLabel,
    alert: lar.alert,
    classAlert: lar.classAlert
  };
}

export function fixMatScadutoDates(lar: MatScaduto): MatScaduto {
  return {
    id: lar.id,
    controlDate: dtoToDate(lar.controlDate),
    cdc: lar.cdc,
    codMateriale: lar.codMateriale,
    descMateriale: lar.descMateriale,
    expireDate: dtoToDate(lar.expireDate),
    quantity: lar.quantity,
    notes: lar.notes,
    tooltipNotes: lar.tooltipNotes,
    //um: lar.um,
    type: lar.type,
    lotto: lar.lotto,
    // classIcon: lar.classIcon,
    // compilatore: lar.compilatore,
    // qualificaCompilatore: lar.qualificaCompilatore,
    // noteRitiro: lar.noteRitiro,
    // dataRitiro: dtoToDate(lar.dataRitiro)
  };
}


/**
 * Creates an `HttpParams` object from a basic paginated filter.
 * @param filter A pagination filter
 * @returns An `HttpParams` object that includes just the basic pagination parameters.
 */
export function mkPaginatedHttpParams(filter?: PaginatedFilter): HttpParams {
  if (!filter) { return null; }

  const fromObject: any = {};
  if (filter.count) { fromObject.count = filter.count; }
  if (filter.offset) { fromObject.offset = filter.offset; }

  return new HttpParams({ fromObject });
}

export function mkHttpParams(urlMenu?: string): HttpParams {
  if (!urlMenu) { return null; }

  const fromObject: any = {};
  if (urlMenu) { fromObject.urlMenu = urlMenu; }
  return new HttpParams({ fromObject });
}

/**
 * Creates a new `SortingFilter` object from a Material `Sort` object.
 * @param sort A Material sort object
 * @returns A new `SortingFilter` object
 */
export function mkSorting(sort: Sort): SortingFilter {
  const s: SortingFilter = {};
  const inSort: { active: string, direction: SortDirection } = sort;

  if (inSort.active) {
    s.sortBy = inSort.active;
  }
  switch (inSort.direction) {
    case 'asc':
      s.sortDir = SortingDir.ASC;
      break;
    case 'desc':
      s.sortDir = SortingDir.DESC;
      break;
  }
  return s;
}

/**
 * Prepares a map of HTTP URL parameters that can be later used to create `HttpParams`.
 * @param filter A paginating and sorting filter
 * @returns An objects whose keys will turn into HTTP URL parameters when passed to `HttpParams`.
 */
export function mkHttpParamsMap(filter?: PaginatedFilter & SortingFilter): any {
  const obj: any = {};
  if (!filter) { return obj; }
  if (filter.count) { obj.count = filter.count; } else { obj.count = 10; }
  if (filter.offset) { obj.offset = filter.offset; }
  if (filter.sortBy) { obj.sortBy = filter.sortBy; }
  if (filter.sortDir) { obj.sortDir = filter.sortDir; }
  return obj;
}

export function withAggregations<T>(result: IResult<T>, keys: { [code: string]: AggregationKey[] }): IResult<T> & WithAggregations {
  return {
    ...result,
    aggregations: keys
  };
}
