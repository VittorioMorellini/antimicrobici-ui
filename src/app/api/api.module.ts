import { StampeService } from "./stampe.service";
import { DottoriService } from "src/app/api/dottori.service";
import { MaterialiService } from "./materiali.service";
// angular
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CommonsModule } from "../commons/commons.module";

// api
import { ApiConfig } from "./api-config";
import { ApiClientService } from "./client.service";
import { MenuService } from "./menu.service";
import { UserService } from "./user.service";
import { RichiesteService } from "./richieste.service";
import { RichiedentiService } from "./richiedenti.service";
import { PrioritaService } from "./priorita.service";
import { StatiService } from "./stati.service";
import { CdcService } from "./cdc.service";
import { TipiMaterialeService } from "./tipi-materiale.service";
import { MaterialiScadutiService } from "./materiali-scaduti.service";
import { CatalogoService } from "./catalogo.service";
import { RegistroMaterialiScadutiService } from "./registro-materiali-scaduti.service";

@NgModule({
  imports: [CommonModule, HttpClientModule, CommonsModule],
  declarations: [],
})
export class ApiModule {
  /*
   * Configures the ApiModule.
   *
   * @param config Module configuration
   * @return The module with the providers
   */
  static forRoot(config: ApiConfig): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        { provide: ApiConfig, useValue: config },
        ApiClientService,
        RichiesteService,
        RichiedentiService,
        StatiService,
        PrioritaService,
        MenuService,
        UserService,
        MaterialiService,
        DottoriService,
        CdcService,
        TipiMaterialeService,
        MaterialiScadutiService,
        CatalogoService,
        RegistroMaterialiScadutiService,
        StampeService,
      ],
    };
  }
}
