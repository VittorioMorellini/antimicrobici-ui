import { Component, Inject, ViewChild, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: "app-report-dialog-component",
  templateUrl: "report-dialog.component.html",
})
export class ReportDialogComponent implements OnInit {
  // @ViewChild('pdfViewerOnDemand') pdfViewerOnDemand;
  @ViewChild("pdfViewerAutoLoad", null) pdfViewerAutoLoad;
  url: string;
  nomeReport: string;
  loading = false;
  title: string;
  id: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.loading = true;
    console.log(`Loading is: ${this.loading}`);
    this.title = data.title;
    this.id = data.id;
    this.nomeReport = data.nomeReport;
    setTimeout(() => {
      console.log(`Loading is: ${this.loading}`);
    }, 2000);

    if (this.nomeReport === "Materiali") {
      this.url = "api/report?reportName=" + data.url + "&id=" + data.id;
      // passato dal Chiamante
    } else if (false) {
      // Todo
    }
    console.log(`Url is : ${this.url}`);
    this.downloadFile(this.url).subscribe((res) => {
      // console.log(`Report is loading:`);
      this.pdfViewerAutoLoad.pdfSrc = res; // pdfSrc can be Blob or Uint8Array
      this.pdfViewerAutoLoad.refresh(); // Ask pdf viewer to load/refresh pdf
      this.loading = false;
    });
  }

  ngOnInit() {}

  private downloadFile(url: string): any {
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
}
