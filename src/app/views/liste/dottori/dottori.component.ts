import { RichiestaRecord, Richiesta } from './../../../api/dto';
import { RichiestaFilter, PageSorting, Page } from './../../../api/filters';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, RowClassArgs} from '@progress/kendo-angular-grid';
import {SortDescriptor, State} from '@progress/kendo-data-query';

import {Observable, Subject, merge} from 'rxjs';
import { map, catchError, debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

import {NamedEntity, Result} from '../../../api/dto';
import {SospensioneFilter} from '../../../api/filters';
import { MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mkSorting } from 'src/app/api/utils';
import { DottoriService } from 'src/app/api/dottori.service';
import { drill } from 'src/app/commons/commons';

interface Filter {
  richiedente?: NamedEntity;
  materiale?: NamedEntity;
  dataDa?: Date;
  dataA?: Date;
  medico?: string;
  motivazione?: string;
  destinatario?: string;
  stato?: string;
  isInfettivologo: boolean;
}

const LISTA_ATTESA_COLUMNS = [
  'nrImpegno',
  'dataCreazioneImpegno',
  'cdc_nome',
  'dataErogazione',
  'motivazione',
  'materiale',
  'medicoRichiedente',
  'destinatarioPazienteDettaglio',
  'consulenzaInfettivologica',
  'medicoUO',
  'antibiogramma',
  'qtaRichiesta',
  'quantita',
  'icon_color',
  'statoMedico',
  'inserimentoUtente',
  // 'inserimentoData',
  'modificaDataMedico',
  'noteMedico',
  'spazio',
  'comando'
];

@Component({
  selector: 'app-dottori',
  templateUrl: './dottori.component.html',
  styleUrls: ['./dottori.component.scss']
})
export class DottoriComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy: Subject<any>;
  private readonly refresh: Subject<PageSorting>;

  /** Whether the number of selected elements matches the total number of rows. */
  displayedColumns: string[] = LISTA_ATTESA_COLUMNS;
  richiedenti: Observable<NamedEntity[]>;
  materiali: Observable<NamedEntity[]>;
  stati: Observable<NamedEntity[]>;
  editedData: RichiestaRecord[];
  filter: Filter = {isInfettivologo: true};
  dataSource: RichiestaRecord[] = [];
  total = 0;
  loading = false;
  saving = false;
  expandedElement: RichiestaRecord | null;
  richiesta: RichiestaRecord;

  @ViewChild(MatPaginator, {static: true})
  private paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  private sorter: MatSort;
  // @ViewChild('gridForm', null) gridForm: NgForm;

  constructor(private readonly route: ActivatedRoute, private readonly client: DottoriService,
              private readonly snackBar: MatSnackBar) {
    this.richiedenti = route.data.pipe(map((data: { richiedenti: Result<NamedEntity> }) => data.richiedenti.results));
    this.materiali = route.data.pipe(map((data: { materiali: Result<NamedEntity> }) => data.materiali.results));
    this.refresh = new Subject<PageSorting>();
    this.destroy = new Subject<any>();

    // data from routing and resolve
    // const obs1 = this.route.data.pipe(map((data: { richieste: Result<RichiestaRecord> }) => {
    //   return data.richieste;
    // }));

    // data from refresh or paginator
    const obs2 = this.refresh.pipe(
      tap(() => console.log('refresh next')),
      debounceTime(300),
      switchMap(ps => {
        this.loading = true;
        return this.client.find(this.mkFilter(ps));
      }));

    // merge(obs1, obs2)
    obs2
      .pipe(
        takeUntil(this.destroy),
        tap(() => this.loading = false),
        catchError((err, obs) => {
          console.error('💥 Unexpected error occurred', err);
          snackBar.open('Impossibile recuperare le richieste', 'Chiudi', {panelClass: 'snack-error'});
          return obs;
        }))
      .subscribe(res => {
        this.dataSource = res.results;
        this.total = res.total;
      });
  }

  ngOnInit() {
    this.expandedElement = null;
    this.paginator._intl.itemsPerPageLabel = 'Records per pagina';
    this.filter.stato = '';
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(takeUntil(this.destroy))
      .subscribe(page => this.refresh.next({...page, ...mkSorting(this.sorter)}));

    this.sorter.sortChange
      .pipe(takeUntil(this.destroy))
      .subscribe(sort => this.refresh.next({...this.mkPage(), ...mkSorting(sort || this.sorter)}));
  }

  /*
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: RichiestaRecord): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nrImpegno}`;
  }
  */

  private mkFilter(ps: PageSorting): RichiestaFilter {
    const filter: RichiestaFilter = {
      codiceRichiedente: this.filter.richiedente ? this.filter.richiedente.codice : undefined,
      codiceMateriale: this.filter.materiale ? this.filter.materiale.codice : undefined,
      medico: this.filter.medico ? this.filter.medico : undefined,
      stato: this.filter.stato ? this.filter.stato : undefined,
      motivazione: this.filter.motivazione ? this.filter.motivazione : undefined,
      destinatario: this.filter.destinatario ? this.filter.destinatario : undefined,
      isInfettivologo: true,
      dataDa: this.filter.dataDa ? this.filter.dataDa : undefined,
      dataA: this.filter.dataA ? this.filter.dataA : undefined,
      count: ps.pageSize,
      offset: ps.pageIndex * ps.pageSize
    };
    if (ps.sortDir) {
      filter.sortBy = ps.sortBy;
      filter.sortDir = ps.sortDir;
    }
    return filter;
  }

  private mkPage(pageIndex: number = 0): Page {
    return {pageIndex, pageSize: this.paginator.pageSize};
  }

  trackById(index: number, row: RichiestaRecord): string {
    return row.nrImpegno;
  }

  search() {
    const page = this.mkPage();
    this.refresh.next(page);
    this.paginator.pageIndex = page.pageIndex;
  }

  drill(row: any, path: string): any {
    return drill(row, path, '_');
  }

  conferma(row: RichiestaRecord) {
    this.saving = true;
    const richi: Richiesta = {nrImpegno: row.nrImpegno, quantita: row.quantita, qtaRichiesta: row.qtaRichiesta};
    const richiesta: RichiestaRecord = {nrImpegno: row.nrImpegno, tipoImpegno: row.tipoImpegno,
      noteMedico: row.noteMedico, quantita: row.quantita,
      cdcRichiedente: {codice: row.cdcRichiedente.codice, nome: row.cdcRichiedente.nome}, qtaRichiesta: row.qtaRichiesta };

    return this.client.addRecord(richiesta)
    .toPromise()
    .then(out => {
      // console.log(`Richiesta saved saved `);
      // f.resetForm();
      map((out: Richiesta) => richi);
      /*
      console.log('ritorno una richiesta: ' + JSON.stringify(richi));
      console.log('ritorno una richiesta: ' + JSON.stringify(out));
      console.log('ritorno una quantita richi: ' + richi.quantita);
      console.log('ritorno una quantita out: ' + out.quantita);
      console.log('ritorno una Data richi: ' + richi.inserimentoData);
      console.log('ritorno una quantita row: ' + row.quantita);
      console.log('ritorno una Data: ' + row.inserimentoData);
      */
      if (richi.quantita !== 0 && richi.quantita !== undefined
        /* && out.inserimentoData !== undefined */) {
        row.classIconMedico = 'green-icon';
        row.modificaDataMedico = new Date();
      } else if (out.quantita === 0) {
        row.classIconMedico = 'yellow-icon';
      }
      this.saving = false;
    }).catch(err => {
      this.snackBar.open('Errore nel salvataggio quantit\à consegnate', 'Chiudi', {panelClass: 'snack-error'});
      this.saving = false;
    });
  }
}
