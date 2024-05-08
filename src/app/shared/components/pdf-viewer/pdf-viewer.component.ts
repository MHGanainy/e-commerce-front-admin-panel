import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
})
export class PDFViewerComponent implements OnInit {
  fileSrc: any;
  filename: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public matDialogRef: MatDialogRef<PDFViewerComponent>) {
    this.fileSrc = this.data.fileSrc;
    this.filename = this.data.name;
  }

  ngOnInit() {}

  close() {
    this.matDialogRef.close();
  }
}
