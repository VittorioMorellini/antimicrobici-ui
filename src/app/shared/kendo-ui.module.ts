import {NgModule} from '@angular/core';

// import {ButtonsModule} from '@progress/kendo-angular-buttons';
// import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
// import {DialogsModule, WindowModule} from '@progress/kendo-angular-dialog';
import {GridModule} from '@progress/kendo-angular-grid';

@NgModule({
  imports: [
    GridModule,
  ],
  exports: [
    GridModule,
  ]
})

export class KendoUiModule {}
