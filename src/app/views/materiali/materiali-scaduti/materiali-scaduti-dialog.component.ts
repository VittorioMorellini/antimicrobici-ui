import { CentroDiCosto, MatScaduto, MatScadutoCatalogo, MatScadutoRecord } from "./../../../api/dto";
import {
  Component,
  Inject,
  PipeTransform,
  ViewChild,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, switchMap, debounceTime, startWith } from "rxjs/operators";
import {
  Result,
  NamedEntity,
} from "src/app/api/dto";
import { CdcService } from "src/app/api/cdc.service";
import {
  NgForm,
  FormGroup,
  FormControl,
  FormBuilder,
  AbstractControl,
} from "@angular/forms";
import { MaterialiService } from "src/app/api/materiali.service";
import { CatalogoService } from "src/app/api/catalogo.service";
import { MaterialiScadutiService } from "src/app/api/materiali-scaduti.service";
import * as moment from "moment";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-materiali-scaduti-dialog-component",
  templateUrl: "./materiali-scaduti-dialog.component.html",
  styleUrls: ["./materiali-scaduti-dialog.component.scss"],
})
export class MaterialiScadutiDialogComponent implements OnInit, AfterViewInit {
  centriDiCosto: CentroDiCosto[];
  materiali: MatScadutoCatalogo[];
  filteredMaterials: MatScadutoCatalogo[];
  filteredCdcs: CentroDiCosto[];
  myMateriale = new FormControl();
  myCdc = new FormControl();
  //matScaduto: MatScaduto;
  model: MatScaduto = { id: null, codMateriale: '' };
  // readonly form: FormGroup;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<MaterialiScadutiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Per passare un dato oggetto generico ad una Dialog
    private readonly cdcClient: CdcService,
    private readonly matClient: CatalogoService,
    private readonly fb: FormBuilder,
    private readonly matService: MaterialiScadutiService
  ) {
    console.log("row: " + data.row);
    console.log("title: " + data.title);
    if (data.row) {
      this.model.controlDate = data.row.controlDate;
      this.model.lotto = data.row.lotto;
      this.model.expireDate = data.row.expireDate;
      this.model.cdc = data.row.cdc;
      this.model.materiale = new NamedEntity();
      this.model.materiale.codice = data.row.codMateriale;
      this.model.materiale.nome = data.row.descMateriale;
      this.model.notes = data.row.notes;
      this.model.quantity = data.row.quantity;
    }
  }

  ngOnInit() {
    /*
     */
    this.myCdc.valueChanges.subscribe((value) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value.length > 1
      ) {
        this.cdcClient.search(value).subscribe((res) => {
          this.filteredCdcs = res.results;
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
        this.matClient.search(value).subscribe((res) => {
          this.filteredMaterials = res.results;
        });
      }
    });
  }

  ngAfterViewInit() {}

  displayMat(materiale: MatScadutoCatalogo): string {
    return materiale && materiale.descMateriale
      ? materiale.codMateriale +
          " " +
          materiale.descMateriale +
          " [" +
          materiale.descUnitaMisura +
          "]"
      : "";
  }

  displayCdc(cdc: CentroDiCosto): string {
    return cdc && cdc.cdc ? cdc.cdc + " [" + cdc.azienda + "]" : "";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /* Non riesco a farlo con il reactive form, non rie4sco a prendere gli oggetti
  get cdc(): CentroDiCosto { return this.form.get('cdc').value; }
  get dataControllo(): AbstractControl { return this.form.get('dataControllo'); }
  get quantita(): AbstractControl { return this.form.get('quantita'); }
  get materiale(): AbstractControl { return this.form.get('materiale'); }
  get lotto(): AbstractControl { return this.form.get('lotto'); }

  private mkMatScaduto(): MatScadutoRecord {
    return {
      id: null,
      cdc: { idCdc: this.cdc.idCdc, cdc: this.cdc.cdc, azienda: this.cdc.azienda },
      dataControllo: this.dataControllo.value,
      dataScadenzaMateriale: null,
      quantita: 0,
      compilatore: '',
      lotto: this.lotto.value,
      idMateriale: this.materiale.value
    };
  }
  */

  private fillMatScadutoRecord(model: MatScaduto): MatScadutoRecord {
    let mate: MatScadutoRecord = {
      id: model.id != null ? model.id : null,
      controlDate: model.controlDate ? new Date(
        moment(model.controlDate).format("YYYY-MM-DD")
      ) : null,
      cdc: model.cdc,
      codCdc: model.cdc != null ? model.cdc.codCdc : '',
      materiale: model.materiale,
      //codMateriale: model.materiale != null ? model.materiale.codice : '',
      //descMateriale: model.materiale != null ? model.materiale.nome : '',
      expireDate: model.expireDate ? new Date(
        moment(model.expireDate).format("YYYY-MM-DD")
      ) : null,
      lotto: model.lotto,
      quantity: model.quantity != null ? model.quantity : 0,
      notes: model.notes,
    };
    console.log({mate})
    return mate;
  }

  save(): void {
    //console.log("Save new record MatScaduto", this.model);
    let item: MatScadutoRecord = this.fillMatScadutoRecord(this.model)    
    console.log('post to item', item)    
    this.matService
      .addRecord(item)
      .toPromise()
      .then((out: MatScadutoRecord) => {
        console.log(`MatScaduto saved WITH ID: ${out}`);
        //f.resetForm();        
      })
      .catch((err) => {
        console.log("An error occurred", err);
      });
  }
}
