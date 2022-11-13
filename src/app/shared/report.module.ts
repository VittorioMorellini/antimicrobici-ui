import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NgModule } from '@angular/core';

@NgModule({
  exports: [
    PdfJsViewerModule,
  ],
  imports: [
    PdfJsViewerModule // <-- Add to declarations
  ],
})
export class ReportModule { }
