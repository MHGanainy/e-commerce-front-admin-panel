import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-success-dialog",
  templateUrl: "./success-dialog.component.html",
  styleUrls: ["./success-dialog.component.scss"],
})
export class SuccessDialogComponent implements OnInit, OnDestroy {
  lang: string;
  visaTimer: any;

  constructor(public dialogRef: MatDialogRef<SuccessDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.lang = localStorage.getItem("lang");
  }

  close(message: string) {
    this.dialogRef.close(message);
  }

  ngOnInit(): void {
    this.visaTimer = setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.visaTimer) clearTimeout(this.visaTimer);
  }
}
