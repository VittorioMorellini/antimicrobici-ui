import { SidePanelComponent } from "./side-panel/side-panel.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { BillOfMaterialsModule } from "./bill-of-materials.module";
import { IconComponent } from "./icon/icon.component";
import { KendoUiModule } from "./kendo-ui.module";
import { NamedEntityPipe } from "./named-entity.pipe";
import { YesOrNoPipe } from "./yes-or-no.pipe";
import { ReportModule } from "./report.module";

@NgModule({
  declarations: [
    IconComponent,
    NamedEntityPipe,
    YesOrNoPipe,
    SidePanelComponent,
  ],
  imports: [
    CommonModule,
    BillOfMaterialsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    KendoUiModule,
    ReportModule,
  ],
  exports: [
    // modules
    BillOfMaterialsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    // components
    IconComponent,
    SidePanelComponent,
    KendoUiModule,
    NamedEntityPipe,
    YesOrNoPipe,
    ReportModule,
  ],
})
export class SharedModule {
  constructor() {
    library.add(fas, far, fab);
  }
}
