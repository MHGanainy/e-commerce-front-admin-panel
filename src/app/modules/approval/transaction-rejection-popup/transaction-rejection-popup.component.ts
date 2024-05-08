import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-transaction-rejection-popup",
  templateUrl: "./transaction-rejection-popup.component.html",
  styleUrls: ["./transaction-rejection-popup.component.scss"],
})
export class TransactionRejectionPopupComponent implements OnInit {
  errorMsg: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<TransactionRejectionPopupComponent>) {}

  ngOnInit(): void {}

  confirm(msg) {
    if (!msg.control.value) this.errorMsg = "Text Area Can't Be Empty";
    else this.dialogRef.close(msg.control.value);
  }

  closeDialog(msg?) {
    this.dialogRef.close();
  }
}
