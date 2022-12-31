import { UserCacheService } from "./../../../shared/user-cache.service";
import { Richiesta, UserProfile } from "./../../../api/dto";
import {animate,state,style,transition,trigger,} from "@angular/animations";
import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from "@angular/core";
import { MatPaginator, MatSort, MatSnackBar } from "@angular/material";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { merge, Observable, Subject } from "rxjs";
import {catchError,debounceTime,map,switchMap,takeUntil,tap,} from "rxjs/operators";
import { RichiestaRecord, NamedEntity, Result } from "../../../api/dto";
import { RichiestaFilter, Page, PageSorting } from "../../../api/filters";
import { RichiesteService } from "../../../api/richieste.service";
import { mkSorting } from "../../../api/utils";
import { drill } from "../../../commons/commons";
import { SelectionModel } from "@angular/cdk/collections";
import { NgForm, FormGroup } from "@angular/forms";
import { DottoriService } from "src/app/api/dottori.service";
import * as moment from "moment";

interface Filter {
  richiedente?: NamedEntity;
  materiale?: NamedEntity;
  dataDa?: Date;
  dataA?: Date;
  medico?: string;
  motivazione?: string;
  destinatario?: string;
  stato?: string;
  statoMedico?: string;
  isInfettivologo: boolean;
}

const LISTA_ATTESA_COLUMNS = [
  "nrImpegno",
  "alert",
  "cdc_nome",
  "dataCreazioneImpegno",
  "materiale",
  "paziente",
  "motivazione",
  "posologia",
  "medicoRichiedente",
  "consulenzaInfettivologica",
  "medicoUO",
  "antibiogramma",
  "qtaRichiesta",
  "quantita",
  "inserimentoData",
  "offLabel",
  "icon_color",
  "note",
  "statoMedico",
  "noteMedico",
  "comando",
];

@Component({
  selector: "app-farmacisti",
  templateUrl: "./farmacisti.component.html",
  styleUrls: ["./farmacisti.component.scss"],
})
export class FarmacistiComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy: Subject<any>;
  private readonly refresh: Subject<PageSorting>;

  /** Whether the number of selected elements matches the total number of rows. */
  displayedColumns: string[] = LISTA_ATTESA_COLUMNS;
  richiedenti: Observable<NamedEntity[]>;
  materiali: Observable<NamedEntity[]>;
  stati: Observable<NamedEntity[]>;
  editedData: RichiestaRecord[];
  filter: Filter = { isInfettivologo: false };
  dataSource: RichiestaRecord[] = [];
  total = 0;
  alert = false;
  isInfettivologo = false;
  loading = false;
  saving = false;
  expandedElement: RichiestaRecord | null;
  richiesta: RichiestaRecord;
  filtroReparto = "Tutti le richieste";
  // checkbox
  checked = false;
  indeterminate = false;

  @ViewChild(MatPaginator, { static: true })
  private paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  private sorter: MatSort;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly client: RichiesteService,
    private readonly snackBar: MatSnackBar,
    private readonly userServ: UserCacheService,
    private readonly dottori: DottoriService
  ) {
    this.richiedenti = route.data.pipe(
      map(
        (data: { richiedenti: Result<NamedEntity> }) => data.richiedenti.results
      )
    );
    this.materiali = route.data.pipe(
      map((data: { materiali: Result<NamedEntity> }) => data.materiali.results)
    );
    this.userServ.load().subscribe((res) => {
      this.isInfettivologo = res.isInfettivologo;
    });
    this.refresh = new Subject<PageSorting>();
    this.destroy = new Subject<any>();

    // data from refresh or paginator
    const obs2 = this.refresh.pipe(
      tap(() => console.log('refresh next arrive')),
      debounceTime(300),
      switchMap((ps) => {
        this.loading = true;
        return this.client.find(this.mkFilter(ps));
      })
    );

    // merge(obs1, obs2)
    obs2
      .pipe(
        takeUntil(this.destroy),
        tap(() => (this.loading = false)),
        catchError((err, obs) => {
          console.error("💥 Unexpected error occurred", err);
          snackBar.open("Impossibile recuperare le richieste", "Chiudi", {
            panelClass: "snack-error",
          });
          return obs;
        })
      )
      .subscribe((res) => {
        this.dataSource = res.results;
        this.total = res.total;
        this.alert = res.alert;
        if (res.alert === true) {
          this.snackBar.open(
            "Richiesta triplicata negli ultimi 7 giorni",
            "Chiudi",
            { panelClass: "snack-error" }
          );
        }
      });
  }

  ngOnInit() {
    this.expandedElement = null;
    this.paginator._intl.itemsPerPageLabel = "Records per pagina";
    this.filter.stato = "";
    this.filter.statoMedico = "";
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(takeUntil(this.destroy))
      .subscribe((page) =>
        this.refresh.next({ ...page, ...mkSorting(this.sorter) })
      );

    this.sorter.sortChange.pipe(takeUntil(this.destroy)).subscribe((sort) =>
      this.refresh.next({
        ...this.mkPage(),
        ...mkSorting(sort || this.sorter),
      })
    );
  }

  showNote(row: RichiestaRecord, isMedico: boolean): string {
    if (isMedico) {
      return row.noteMedico;
    }
    return row.note;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  private mkFilter(ps: PageSorting): RichiestaFilter {
    const filter: RichiestaFilter = {
      codiceRichiedente: this.filter.richiedente
        ? this.filter.richiedente.codice
        : undefined,
      codiceMateriale: this.filter.materiale
        ? this.filter.materiale.codice
        : undefined,
      medico: this.filter.medico ? this.filter.medico : undefined,
      stato: this.filter.stato ? this.filter.stato : undefined,
      statoMedico: this.filter.statoMedico
        ? this.filter.statoMedico
        : undefined,
      isInfettivologo: this.isInfettivologo,
      motivazione: this.filter.motivazione
        ? this.filter.motivazione
        : undefined,
      destinatario: this.filter.destinatario
        ? this.filter.destinatario
        : undefined,
      dataDa: this.filter.dataDa ? this.filter.dataDa : undefined,
      dataA: this.filter.dataA ? this.filter.dataA : undefined,
      count: ps.pageSize,
      offset: ps.pageIndex * ps.pageSize,
    };
    if (ps.sortDir) {
      filter.sortBy = ps.sortBy;
      filter.sortDir = ps.sortDir;
    }
    return filter;
  }

  private mkPage(pageIndex: number = 0): Page {
    return { pageIndex, pageSize: this.paginator.pageSize };
  }

  trackById(index: number, row: RichiestaRecord): string {
    return row.nrImpegno;
  }

  search() {
    console.log('search click event')
    const page = this.mkPage();
    this.refresh.next(page);
    this.paginator.pageIndex = page.pageIndex;
  }

  drill(row: any, path: string): any {
    return drill(row, path, "_");
  }

  exportExcel(): void {
    console.log("sono in export excel");
    this.loading = true;
    // this.excelService.getExcelfile(this.mkFilter()).subscribe(response => this.downLoadFile(response, 'application/ms-excel')
    const filter: RichiestaFilter = {
      codiceRichiedente: this.filter.richiedente
        ? this.filter.richiedente.codice
        : undefined,
      codiceMateriale: this.filter.materiale
        ? this.filter.materiale.codice
        : undefined,
      medico: this.filter.medico ? this.filter.medico : undefined,
      stato: this.filter.stato ? this.filter.stato : undefined,
      statoMedico: this.filter.statoMedico
        ? this.filter.statoMedico
        : undefined,
      isInfettivologo: this.isInfettivologo,
      motivazione: this.filter.motivazione
        ? this.filter.motivazione
        : undefined,
      destinatario: this.filter.destinatario
        ? this.filter.destinatario
        : undefined,
      dataDa: this.filter.dataDa ? this.filter.dataDa : undefined,
      dataA: this.filter.dataA ? this.filter.dataA : undefined,
      count: 0,
      offset: 0,
      sortBy: "ID",
      sortDir: 1,
    };
    this.client.DownloadExcel(filter).subscribe(
      (response) => {
        this.downloadMyFile(response, "Richieste.xlsx");
      },
      (error) => {
        console.error("💥 Unexpected error occurred", error);
        this.snackBar.open("Impossibile eseguire l'esportazione", "Chiudi", {
          panelClass: "snack-error",
        });
        this.loading = false;
      }
    );
  }

  save(row: RichiestaRecord) {
    this.saving = true;
    // tslint:disable-next-line: max-line-length
    let richi: RichiestaRecord = {
      nrImpegno: row.nrImpegno,
      qtaRichiesta: row.qtaRichiesta,
      quantita: row.quantita,
      inserimentoData: row.inserimentoData,
    };
    if (!this.isInfettivologo) {
      const richiesta: RichiestaRecord = {
        nrImpegno: row.nrImpegno,
        tipoImpegno: row.tipoImpegno,
        quantita: row.quantita,
        note: row.note,
        cdcRichiedente: {
          codice: row.cdcRichiedente.codice,
          nome: row.cdcRichiedente.nome,
        },
        qtaRichiesta: row.qtaRichiesta,
        offLabel: row.offLabel,
      };
      return (
        this.client
          .addRecord(richiesta)
          // il map, mergeMap... va fatto sugli observable, prima del toPromise()
          // .pipe(map(res => richi.inserimentoData = res.inserimentoData))
          .subscribe((res) => {
            console.log(`Richiesta saved out: ` + JSON.stringify(res));
            richi = res;
            if (richi.inserimentoData) {
              row.classIcon = "green-icon td-icon";
              row.inserimentoData = richi.inserimentoData;
            } else if (richi.inserimentoData) {
              row.classIcon = "yellow-icon td-icon";
            }
            this.saving = false;
          },
            (err) => {
              this.snackBar.open(
                "Errore nel salvataggio quantità consegnate " + err,
                "Chiudi",
                { panelClass: "snack-error" }
              );
              this.saving = false;
            })
      );
    } else {
      const richiesta: RichiestaRecord = {
        nrImpegno: row.nrImpegno,
        tipoImpegno: row.tipoImpegno,
        noteMedico: row.noteMedico,
        quantita: row.quantita,
        inserimentoData: row.inserimentoData,
        cdcRichiedente: {
          codice: row.cdcRichiedente.codice,
          nome: row.cdcRichiedente.nome,
        },
        qtaRichiesta: row.qtaRichiesta,
        offLabel: row.offLabel,
      };
      if (!row.inserimentoData) {
        this.snackBar.open("Terapia non dispensata", "Chiudi", {
          panelClass: "snack-error",
        });
        row.noteMedico = "";
        this.saving = false;
        return;
      }
      return this.dottori
        .addRecord(richiesta)
        .toPromise()
        .then((res) => {
          richi = res;
          if (richi.modificaDataMedico) {
            row.classIconMedico = "green-icon td-icon";
            row.modificaDataMedico = richi.modificaDataMedico;
          } else if (!res.modificaDataMedico) {
            row.classIconMedico = "yellow-icon td-icon";
          }
          this.saving = false;
        })
        .catch((err) => {
          this.snackBar.open(
            "Errore nel salvataggio quantità consegnate",
            "Chiudi",
            { panelClass: "snack-error" }
          );
          this.saving = false;
        });
    }
  }

  downloadMyFile(response: any, filename: string = null): void {
    // console.log("Sono nel metodo che scarica l'excel nel browser");

    const dataType = "application/vnd.ms-excel";
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, { type: dataType })
    );
    if (filename) {
      downloadLink.setAttribute("download", filename);
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
    this.loading = false;
  }
}
