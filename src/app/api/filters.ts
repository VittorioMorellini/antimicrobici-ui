/*
 * DTO parameters used to filter and order results.
 */

export interface PaginatedFilter {
  offset?: number;
  count?: number;
}

export enum SortingDir {
  ASC = 1,
  DESC = 2
}

export interface SortingFilter {
  sortBy?: string;
  sortDir?: SortingDir;
}

export interface Page {
  pageIndex: number;
  pageSize: number;
}

export type PageSorting = Page & SortingFilter;

export interface StampeFilter {
  urlMenu?: string;
}

export interface RichiestaFilter extends PaginatedFilter, SortingFilter {
  codiceRichiedente?: string;
  codiceMateriale?: string;
  medico?: string;
  dataDa?: Date;
  dataA?: Date;
  motivazione?: string;
  destinatario?: string;
  stato?: string;
  statoMedico?: string;
  isInfettivologo: boolean;
}

export interface MatScadutoFilter extends PaginatedFilter, SortingFilter {
  unitaOperativa?: string;
  codiceRichiedente?: string;
  materiale?: string;
  tipo?: string;
  cdc?: string;
  dataDa?: Date;
  dataA?: Date;
  stato?: string;
  statoMedico?: string;
  nomeMateriale?: string;
}

export interface PresidioFilter extends SortingFilter {
  codicePresidio: string;
  priority?: string;
}

export interface ErroreFilter {
  listaNONInviate?: boolean;
  listaErroreInInvio?: boolean;
  listaErroreInUpdate?: boolean;
  listaDatiMancanti?: boolean;
}

export interface ErroreInvioFilter extends PaginatedFilter, SortingFilter {
  codiceReparto?: string;
  codicePriorita?: string;
  idLista?: string;
  assistito?: string;
  listaInviateCorrettamente?: boolean;
  listaNONInviate?: boolean;
  listaErroreInInvio?: boolean;
  listaErroreInUpdate?: boolean;
  listaDatiMancanti?: boolean;
  errore?: string;
}

export interface SospensioneFilter extends PaginatedFilter, SortingFilter {
  codiceReparto?: string;
  codicePriorita?: string;
  idLista?: string;
  assistito?: string;
  listaSospeseSenzaSospensione?: boolean;
  listaSospeseConSospensioneAttiva?: boolean;
  listaSospeseConSospensioneInScadenza3gg?: boolean;
  listaSospeseConSospensioneScaduta?: boolean;
  listaNonSospeseConSospensione?: boolean;
}

export interface SospensioneDetailFilter extends PaginatedFilter {
  idLista: string;
}
