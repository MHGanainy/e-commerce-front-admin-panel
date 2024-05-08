import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorDialogComponent } from "../../shared/popup-components/error-dialog/error-dialog.component";

@Injectable({
  providedIn: "root"
})
export class ErrorDialogService {
  public isDialogOpen: Boolean = false;

  constructor(public dialog: MatDialog) { }

  openDialog(data: any): any {
    if (!this.isDialogOpen) {

      this.isDialogOpen = true;
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        width: "300px",
        data: data
      });

      dialogRef.afterClosed().subscribe(result => {
        this.isDialogOpen = false;
      });
    }
  }
}
