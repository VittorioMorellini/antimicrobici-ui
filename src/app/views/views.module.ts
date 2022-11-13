import { ReportDialogComponent } from "./report/report-dialog.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// app modules
import { ApiModule } from "../api/api.module";
import { CommonsModule } from "../commons/commons.module";
import { I18nModule } from "../i18n/i18n.module";
import { SharedModule } from "../shared/shared.module";
// app view modules
import { ForbiddenComponent } from "./forbidden/forbidden.component";
// import {RepartiGeneralComponent} from './liste-attesa/reparti-general/reparti-general.component';
import { FarmacistiComponent } from "./liste/farmacisti/farmacisti.component";
import { DottoriComponent } from "./liste/dottori/dottori.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoadingScreenInterceptor } from "./loading.interceptor";
import { MaterialiScadutiComponent } from "./materiali/materiali-scaduti/materiali-scaduti.component";
import { ConfirmationDialogComponent } from "./dialog/confirmation-dialog.component";
import { MaterialiScadutiDialogComponent } from "./materiali/materiali-scaduti/materiali-scaduti-dialog.component";
import { RegistroMaterialiScadutiComponent } from "./materiali/materiali-scaduti/registro-materiali-scaduti.component";
import { MessageDialogComponent } from "./dialog/message-dialog.component";

@NgModule({
  declarations: [
    FarmacistiComponent,
    ForbiddenComponent,
    DottoriComponent,
    MaterialiScadutiComponent,
    ConfirmationDialogComponent,
    MaterialiScadutiDialogComponent,
    RegistroMaterialiScadutiComponent,
    ReportDialogComponent,
    MessageDialogComponent,
  ],
  imports: [
    // angular
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // application
    ApiModule,
    CommonsModule,
    I18nModule,
    SharedModule,
  ],
  /*
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true,
    },
  ],*/
  entryComponents: [
    ConfirmationDialogComponent,
    MaterialiScadutiDialogComponent,
    ReportDialogComponent,
    MessageDialogComponent,
  ],
  exports: [
    FarmacistiComponent,
    ForbiddenComponent,
    DottoriComponent,
    MaterialiScadutiComponent,
    ConfirmationDialogComponent,
    MaterialiScadutiDialogComponent,
    RegistroMaterialiScadutiComponent,
    ReportDialogComponent,
    MessageDialogComponent,
  ],
})
export class ViewsModule {}
