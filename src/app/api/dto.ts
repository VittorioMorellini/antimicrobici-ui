//import { RichiestaRecord } from "./dto";
/*
 * DTO models for API I/O.
 */

/**
 * Helper class used to wrap arrays of any type.
 */
export interface Result<T> {
  total: number;
  results: T[];
  alert: boolean;
}

/**
 * An entity is always identified by a `codice` and, optionally, by a `nome`.
 */
export class NamedEntity {
  codice: string;
  nome?: string;
}

/**
 * A `WithAggregations` interface provides a map of aggregations. Each entry of the map is a recursive
 * structure that specifies a `key`, a `value`, an optional `count` and an optional list of
 * sub-keys with their nested counts.
 *
 * @example
 *  {
 *    "aggregations": {
 *      "state-and-priority": [
 *        {
 *          "key": "state",
 *          "value": {"codice": "done", "nome": "Done"},
 *          "keys": [
 *            { "key": "priority", "value": {"codice": "B", "nome": "Pr. B"}, "count": 100 },
 *            { "key": "priority", "value": {"codice": "P", "nome": "Pr. P"}, "count": 200 },
 *            { "key": "priority", "value": {"codice": "D", "nome": "Pr. D"}, "count": 300 },
 *            { "key": "priority", "value": {"codice": "U", "nome": "Pr. U"}, "count": 400 }
 *          ]
 *        },
 *        {
 *          "key": "state",
 *          "value": {"codice": "pending", "nome": "Pending"},
 *          "keys": [
 *            { "key": "priority", "value": {"codice": "B", "nome": "Pr. B"}, "count": 50 },
 *            { "key": "priority", "value": {"codice": "P", "nome": "Pr. P"}, "count": 20 },
 *            { "key": "priority", "value": {"codice": "D", "nome": "Pr. D"}, "count": 30 },
 *            { "key": "priority", "value": {"codice": "U", "nome": "Pr. U"}, "count": 40 }
 *          ]
 *        }
 *      ]
 *    }
 *  }
 */
export interface WithAggregations {
  aggregations: { [code: string]: AggregationKey[] };
}

export interface AggregationKey {
  key: string;
  value: NamedEntity;
  count?: number;
  keys?: AggregationKey[];
}

export interface Assistito extends NamedEntity {
  cognome: string;
  dataNascita: Date;
  residenza: NamedEntity;
}

export interface Ospedale extends NamedEntity {
  codiceStrutturaSigla: string;
}

/**
 * A simplified view "lista d'attesa", suitable for table results.
 */
export interface RichiestaRecord {
  nrImpegno: string;
  quantita?: number;
  tipoImpegno?: string;
  cdcRichiedente?: NamedEntity;
  qtaRichiesta: number;
  codiceMateriale?: string;
  descrizioneMateriale?: string;
  dataErogazione?: Date;
  motivazione?: string;
  inserimentoData?: Date;
  stato?: number;
  medicoRichiedente?: string;
  destinatarioPazienteDettaglio?: string;
  dataCreazioneImpegno?: Date;
  classIcon?: string;
  classIconMedico?: string;
  note?: string;
  consulenzaInfettivologica?: string;
  medicoUO?: string;
  antibiogramma?: string;
  noteMedico?: string;
  statoMedico?: number;
  modificaDataMedico?: Date;
  modificaUtenteMedico?: string;
  posologia?: string;
  offLabel?: boolean;
  alert?: boolean;
  classAlert?: string;
}

export class MatScaduto {
  id?: number;
  controlDate?: Date;
  codCdc?: string;
  cdc?: CentroDiCosto;
  materiale?: NamedEntity;
  expireDate?: Date;
  quantity?: number;
  notes?: string;
  //um?: string;
  lotto?: string;
  codMateriale: string;
  descMateriale?: string
  compileUser?:  string
  qualificationUser?: string
  retirementUser?: string
  retirementDate?: Date;
  retirementNotes?: string
  tooltipNotes?: string;
  type?: NamedEntity;

  constructor() {}
}

export interface MatScadutoRecord {
  id: number | null;
  controlDate: Date | null;
  cdc: CentroDiCosto | null;
  codCdc?: string;
  materiale: NamedEntity | null;
  codMateriale?: string;
  descMateriale?: string;
  expireDate: Date | null;
  notes?: string;
  quantity?: number;
  lotto?: string;
}


export type Richiesta = RichiestaRecord;

export interface CentroDiCosto {
  codCdc: string;
  cdc: string;
  azienda: string;
}
/**
 * A menu entry that may hold nested entries.
 */
export interface MenuEntry {
  id: string;
  name: string;
  icon?: string;
  items?: MenuEntry[];
}

/**
 * A user profile concerning menu visibility.
 */
export interface MenuProfile {
  landingPage: string;
  menu: MenuEntry[];
}

/**
 * The general user profile.
 */
export interface UserProfile {
  landingPage: string;
  id: string;
  descrizione: string;
  domain: string;
  isInfettivologo: boolean;
}

export interface MatScadutoCatalogo {
  azienda: string;
  codMateriale: string;
  descMateriale: string;
  codUnitaMisura: string;
  descUnitaMisura: string;
  codTipoMateriale: string;
  descTipoMateriale: string;
  codGruppoMerceologico: string;
}
