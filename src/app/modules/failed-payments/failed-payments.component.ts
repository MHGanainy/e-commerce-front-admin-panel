import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { UserDAOService } from "src/app/core/http/user-dao.service";
import { SuccessDialogComponent } from "src/app/shared/components/success-dialog/success-dialog.component";
import { TransactionModel } from "src/app/shared/models/Transaction.model";
import { ErrorDialogComponent } from "src/app/shared/popup-components/error-dialog/error-dialog.component";

@Component({
  selector: "app-failed-payments",
  templateUrl: "./failed-payments.component.html",
  styleUrls: ["./failed-payments.component.scss"],
})
export class FailedPaymentsComponent implements OnInit {
  displayedColumns = ["ID", "firstName", "lastName", "mobile", "amount", "offerID", "date", "update"];
  reloadHoverClass: string;
  dataSource: MatTableDataSource<any>;
  loading = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  constructor(private userDAOService: UserDAOService, public dialog: MatDialog) {
    this.getPaymentIncomplete();
  }

  getPaymentIncomplete() {
    this.loading = true;
    this.userDAOService.getPaymentIncomplete().subscribe(
      (res: TransactionModel[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: "Something went wrong. Please try again later",
          },
        });
      }
    );
  }
  createPayment(transaction: TransactionModel) {
    this.loading = true;
    this.userDAOService.createPayment(transaction).subscribe(
      (res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          panelClass: "login-md-dialog-container",
          data: {
            message: "Transaction updated successfully",
          },
        });
        this.getPaymentIncomplete();
      },
      (error) => {
        this.loading = false;
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: "Something went wrong. Please try again later",
          },
        });
      }
    );
  }
  ngOnInit(): void {}
}
