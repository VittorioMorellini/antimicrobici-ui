import { UserCacheService } from "./../../../shared/user-cache.service";
import {
  Richiesta,
  UserProfile,
  MatScaduto,
  CentroDiCosto,
  MatScadutoCatalogo,
} from "./../../../api/dto";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatSnackBar,
  MatDialogModule,
  Sort,
} from "@angular/material";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { merge, Observable, Subject } from "rxjs";
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  takeUntil,
  tap,
  startWith,
  mapTo,
} from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { RichiestaRecord, NamedEntity, Result } from "../../../api/dto";
import {
  RichiestaFilter,
  Page,
  PageSorting,
  MatScadutoFilter,
} from "../../../api/filters";
import { RichiesteService } from "../../../api/richieste.service";
import { mkSorting } from "../../../api/utils";
import { drill } from "../../../commons/commons";
import { SelectionModel } from "@angular/cdk/collections";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import { CdcService } from "src/app/api/cdc.service";
import * as moment from "moment";
import { MaterialiScadutiService } from "src/app/api/materiali-scaduti.service";
import { ConfirmationDialogComponent } from "../../dialog/confirmation-dialog.component";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { MaterialiScadutiDialogComponent } from "./materiali-scaduti-dialog.component";
import { CatalogoService } from "src/app/api/catalogo.service";
import { ReportDialogComponent } from "../../report/report-dialog.component";
import { MessageDialogComponent } from "../../dialog/message-dialog.component";

interface Filter {
  richiedente?: NamedEntity;
  materiale?: NamedEntity;
  dataDa?: Date;
  dataA?: Date;
  cdc?: CentroDiCosto;
  tipo?: NamedEntity;
  stato?: string;
}

const MATERIALI_COLUMNS = [
  "select",
  "icon_color",
  "id",
  "dataControllo",
  "centroDiCosto",
  "tipo",
  "materiale",
  "UM",
  "qta",
  "scadenzaMateriale",
  "lotto",
  "compilatore",
  "qualificaCompilatore",
  "note",
  "cmdDel",
  "cmdDuplica",
  /*
  "dataCreazioneImpegno",
  "paziente",
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
  */
];

@Component({
  selector: "app-materiali-scaduti",
  templateUrl: "./materiali-scaduti.component.html",
  styleUrls: ["./materiali-scaduti.component.scss"],
})
export class MaterialiScadutiComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy: Subject<any>;
  private readonly refresh: Subject<PageSorting>;

  /* Whether the number of selected elements matches the total number of rows. */
  displayedColumns: string[] = MATERIALI_COLUMNS;
  richiedenti: Observable<NamedEntity[]>;
  materiali: NamedEntity[] = [];
  cdcs: CentroDiCosto[];
  filteredOptions: CentroDiCosto[];
  filteredMates: MatScadutoCatalogo[];
  tipiMateriale: Observable<NamedEntity[]>;
  editedData: MatScaduto[];
  filter: Filter = {};
  dataSource: MatScaduto[] = [];
  total = 0;
  alert = false;
  isInfettivologo = false;
  loading = false;
  saving = false;
  // expandedElement: RichiestaRecord | null;
  matScaduto: MatScaduto;
  myCdc = new FormControl();
  myMateriale = new FormControl();
  // checkbox
  checked = false;
  indeterminate = false;
  selection: SelectionModel<MatScaduto>;
  initialSelection = [];
  allowMultiSelect = false;
  urlReport: string;

  @ViewChild(MatPaginator, { static: true })
  private paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  public sorter: MatSort;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly client: MaterialiScadutiService,
    private readonly snackBar: MatSnackBar,
    private readonly userServ: UserCacheService,
    private readonly cdcService: CdcService,
    private readonly dialog: MatDialog,
    private readonly catService: CatalogoService,
    private router: Router
  ) {
    this.richiedenti = route.data.pipe(
      map(
        (data: { richiedenti: Result<NamedEntity> }) => data.richiedenti.results
      )
    );

    this.tipiMateriale = route.data.pipe(
      map(
        (data: { tipiMateriale: Result<NamedEntity> }) =>
          data.tipiMateriale.results
      )
    );

    route.data
      .pipe(map((data: { urlReport: string }) => data.urlReport))
      .subscribe((res) => {
        this.urlReport = res;
      });

    this.selection = new SelectionModel<MatScaduto>(
      this.allowMultiSelect,
      this.initialSelection
    );
    this.refresh = new Subject();
    this.destroy = new Subject();

    // data from refresh or paginator
    const obs2 = this.refresh.pipe(
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
      });
  }

  ngOnInit() {
    // this.expandedElement = null;
    this.paginator._intl.itemsPerPageLabel = "Records per pagina";
    this.filter.stato = "";

    this.myCdc.valueChanges.subscribe((value) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value.length > 1
      ) {
        this.cdcService.search(value).subscribe((res) => {
          this.filteredOptions = res.results;
        });
      }
    });

    this.myMateriale.valueChanges.subscribe((value) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value.length > 1
      ) {
        this.catService
          .search(value)
          .toPromise()
          .then((res) => {
            this.filteredMates = res.results;
          });
      }
    });
  }

  displayFn(cdc: CentroDiCosto): string {
    return cdc && cdc.cdc ? cdc.cdc + " [" + cdc.azienda + "]" : "";
  }

  displayMat(materiale: MatScadutoCatalogo): string {
    return materiale && materiale.descMateriale
      ? materiale.codMateriale + " " + materiale.descMateriale
      : "";
  }

  openMessage(message: string): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "350px",
      data: message,
    });
    dialogRef.afterClosed().subscribe(() => {});
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

    this.sorting();
  }

  sorting(): void {
    this.sorter.sortChange.pipe(takeUntil(this.destroy)).subscribe((sort) =>
      this.refresh.next({
        ...this.mkPage(),
        ...mkSorting(sort || this.sorter),
      })
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }

  showNote(row: MatScaduto): string {
    return row.tooltipNotes;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Navigate to another Url
  // gotoFarmacisti() {
  //   this.router.navigate(["/c/richieste/farmacisti"]);
  // }

  openDialogAddRecord(
    row: MatScaduto,
    title: string,
    operation: string
  ): void {
    const dialogRef = this.dialog.open(MaterialiScadutiDialogComponent, {
      width: "1000px",
      height: "600px",
      data: { row, title },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Yes clicked");
        // DO Refresh grid
        this.search();
        // mkSorting();
      }
    });
  }

  openDialog(row: MatScaduto, message: string, operation: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data: message,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Yes clicked");
        // DO SOMETHING
        if (operation === "DEL") this.delete(row);
        else if (operation === "DUP") this.duplicate(row);

        this.search();
      }
    });
  }

  private mkFilter(ps: PageSorting): MatScadutoFilter {
    const filter: MatScadutoFilter = {
      codiceRichiedente: this.filter.richiedente
        ? this.filter.richiedente.codice
        : undefined,
      materiale: this.filter.materiale
        ? this.filter.materiale.codice
        : undefined,
      tipo: this.filter.tipo ? this.filter.tipo.codice : undefined,
      stato: this.filter.stato ? this.filter.stato : undefined,
      cdc: this.filter.cdc ? this.filter.cdc.codCdc : undefined,
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
    const page = this.mkPage();
    this.refresh.next({ ...page, ...mkSorting(this.sorter) });
    this.paginator.pageIndex = page.pageIndex;
  }

  drill(row: any, path: string): any {
    return drill(row, path, "_");
  }

  exportExcel(): void {
    console.log("sono in export excel");
    this.loading = true;
    // this.excelService.getExcelfile(this.mkFilter()).subscribe(response => this.downLoadFile(response, 'application/ms-excel')
    const filter: MatScadutoFilter = {
      codiceRichiedente: this.filter.richiedente
        ? this.filter.richiedente.codice
        : undefined,
      materiale: this.filter.materiale
        ? this.filter.materiale.codice
        : undefined,
      tipo: this.filter.tipo ? this.filter.tipo.codice : undefined,
      stato: this.filter.stato ? this.filter.stato : undefined,
      cdc: this.filter.cdc ? this.filter.cdc.codCdc : undefined,
      dataDa: this.filter.dataDa ? this.filter.dataDa : undefined,
      dataA: this.filter.dataA ? this.filter.dataA : undefined,
      count: 0,
      offset: 0,
      sortBy: "ID",
      sortDir: 1,
    };

    this.client.DownloadExcel(filter).subscribe(
      (response) => {
        this.downloadMyFile(response, "MaterialiScaduti.xlsx");
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

  print() {
    // verifico la selezione
    this.matScaduto = this.selection.selected[0];
    console.log(this.matScaduto);
    // TODO, stampa
    if (this.matScaduto) {
      const dialogRef = this.dialog.open(ReportDialogComponent, {
        data: {
          url: this.urlReport,
          title: "Report Materiali scaduti",
          nomeReport: "Materiali",
          id: this.matScaduto.id,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        // console.log(`Dialog result: ${result}`);
      });
    } else {
      this.openMessage("Selezionare un record dalla lista");
    }
  }

  duplicate(row: MatScaduto) {
    console.log("Chiamata operazione duplicazione ");
  }

  delete(row: MatScaduto) {
    this.saving = true;
    return (
      this.client
        .delete(row)
        // il map, mergeMap... va fatto sugli observable, prima del toPromise()
        // .pipe(map(res => richi.inserimentoData = res.inserimentoData))
        .toPromise()
        .then(() => {
          console.log(`MatScaduto Eliminato: ` + row.id);
          // TODO rimuovere item da table
          this.search();
          // this.saving = false;
        })
        .catch((err) => {
          this.snackBar.open(
            "Errore nella cancellazione delle quantità consegnate",
            "Chiudi",
            { panelClass: "snack-error" }
          );
          this.saving = false;
        })
    );
  }
  /*
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
        this.client.addRecord(richiesta)
          // il map, mergeMap... va fatto sugli observable, prima del toPromise()
          // .pipe(map(res => richi.inserimentoData = res.inserimentoData))
          .toPromise()
          .then((res) => {
            console.log(`Richiesta saved out: ` + JSON.stringify(res));
            richi = res;
            if (richi.inserimentoData) {
              row.classIcon = "green-icon td-icon";
              row.inserimentoData = richi.inserimentoData;
            } else if (richi.inserimentoData) {
              row.classIcon = "yellow-icon td-icon";
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
      return this.dottori.addRecord(richiesta)
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
  */

  downloadMyFile(response: any, filename: string = null): void {
    console.log("Sono nel metodo che scarica l'excel nel browser");
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
