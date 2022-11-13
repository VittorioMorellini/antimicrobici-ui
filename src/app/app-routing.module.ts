import { StampeResolverService } from "./views/stampe-resolver.service";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ContentComponent } from "./layout/content/content.component";
import { FocusComponent } from "./layout/focus/focus.component";
import { LayoutModule } from "./layout/layout.module";
import { FarmacistiComponent } from "./views/liste/farmacisti/farmacisti.component";
import { LandingPageGuard } from "./shared/landing-page.guard";
import { MenuGuard } from "./shared/menu.guard";
import { RichiedentiResolverService } from "./views/richiedenti-resolver.service";
import { DottoriComponent } from "./views/liste/dottori/dottori.component";
import { MaterialiResolverService } from "./views/materiali-resolver.service";
import { DottoriResolverService } from "./views/liste/dottori-resolver.service";
import { ForbiddenComponent } from "./views/forbidden/forbidden.component";
import { MaterialiScadutiComponent } from "./views/materiali/materiali-scaduti/materiali-scaduti.component";
import { CdcResolverService } from "./views/cdc-resolver.service";
import { TipiMaterialeResolverService } from "./views/tipi-materiale-resolver.service";
import { CatalogoResolverService } from "./views/catalogo-resolver.service";
import { RegistroMaterialiScadutiComponent } from "./views/materiali/materiali-scaduti/registro-materiali-scaduti.component";

const routes: Routes = [
  {
    path: "c",
    component: ContentComponent,
    canActivate: [LandingPageGuard],
    children: [
      {
        path: "richieste/farmacisti",
        component: FarmacistiComponent,
        //canActivate: [MenuGuard],
        resolve: {
          richiedenti: RichiedentiResolverService,
          materiali: MaterialiResolverService,
        },
      },
      {
        path: "richieste/dottori",
        component: DottoriComponent,
        //canActivate: [MenuGuard],
        resolve: {
          richiedenti: RichiedentiResolverService,
          materiali: MaterialiResolverService,
          // richieste: DottoriResolverService,
        },
      },
      {
        path: "materiali/materialiscaduti",
        component: MaterialiScadutiComponent,
        //canActivate: [MenuGuard],
        resolve: {
          richiedenti: RichiedentiResolverService,
          // materiali: CatalogoResolverService,
          // centriDiCosto: CdcResolverService,
          tipiMateriale: TipiMaterialeResolverService,
          urlReport: StampeResolverService,
        },
      },
      {
        path: "materiali/registro",
        component: RegistroMaterialiScadutiComponent,
        //canActivate: [MenuGuard],
        resolve: {
          richiedenti: RichiedentiResolverService,
          // materiali: CatalogoResolverService,
          // centriDiCosto: CdcResolverService,
          tipiMateriale: TipiMaterialeResolverService,
        },
      },
    ],
  },
  {
    path: "f",
    component: FocusComponent,
    children: [{ path: "forbidden", component: ForbiddenComponent }],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "c",
  },
  {
    path: "**",
    redirectTo: "c",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    // app
    LayoutModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
