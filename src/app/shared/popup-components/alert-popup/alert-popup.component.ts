import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-alert-popup",
  templateUrl: "./alert-popup.component.html",
  styleUrls: ["./alert-popup.component.scss"],
})
export class AlertPopupComponent implements OnInit {
  type: string;
  message: string;

  showOkButton: boolean;
  showYesButton: boolean;
  showCancelButton: boolean;
  showButtonsRow: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      message: string;
      showOkButton?: boolean;
      showYesButton?: boolean;
      showCancelButton?: boolean;
    },
    private dialogRef: MatDialogRef<AlertPopupComponent>
  ) {
    this.type = data.type;
    this.message = data.message;
    this.showOkButton = data.showOkButton;
    this.showYesButton = data.showYesButton;
    this.showCancelButton = data.showCancelButton;

    this.showButtonsRow = this.showOkButton || this.showYesButton || this.showCancelButton;
  }

  ngOnInit() {}

  closeDialog(res?: string) {
    res ? this.dialogRef.close(res) : this.dialogRef.close();
  }
}
