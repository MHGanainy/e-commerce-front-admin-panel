import { DecimalPipe } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { ColumnMode } from "@swimlane/ngx-datatable";
import { parseJSON } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Subscription } from "rxjs";
import { PermissionGuard } from "src/app/core/guards/permission.guard";
import { MediaDAOService } from "src/app/core/http/media-dao.service";
import { PaymentDAOService } from "src/app/core/http/payment-dao.service";
import { ImageViewerPopupComponent } from "src/app/modules/approval/image-viewer-popup/image-viewer-popup.component";
import { PDFViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { RejectionModel } from "src/app/shared/models/Rejection.model";
import { TransactionModel } from "src/app/shared/models/Transaction.model";
import { UnitModel } from "src/app/shared/models/Unit.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";
import { ErrorDialogComponent } from "src/app/shared/popup-components/error-dialog/error-dialog.component";

import { UnitDetailsPopupComponent } from "../../shared/popup-components/unit-details-popup/unit-details-popup.component";
import { UserDetailsPopupComponent } from "../../shared/popup-components/user-details-popup/user-details-popup.component";
import { TransactionRejectionPopupComponent } from "./transaction-rejection-popup/transaction-rejection-popup.component";

declare var $: any;

@Component({
  selector: "app-bank-approval",
  templateUrl: "./bank-approval.component.html",
  styleUrls: ["./bank-approval.component.scss"],
})
export class BankApprovalComponent implements OnInit, OnDestroy {
  @ViewChild("myTable") table: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  transactions: TransactionModel[] = [];
  loading = true;
  isPrintLoading: boolean;
  rejectionModel = new RejectionModel();
  objectKeys = Object.keys;
  subscriptionArray: Subscription[] = [];
  currentTimeZone: string;
  rows = [];
  columns = [
    { name: "BP", prop: "bp", comparator: this.numberComparator },
    { name: "Project Name", prop: "project_name" },
    { name: "Old Unit Code", prop: "ru_old_no" },
    { name: "Transfer ID", prop: "transfer_id", comparator: this.numberComparator },
    { name: "Transfer Date", prop: "transfer_date", comparator: this.dateComparator },
    { name: "Customer Bank", prop: "customer_bank" },
    { name: "TMG Bank", prop: "tmg_bank" },
    { name: "Expected Amount", prop: "expected_amount", comparator: this.numberComparator },
    { name: "Paid Amount", prop: "paid_amount", comparator: this.numberComparator },
    { name: "Offer ID", prop: "offer_id", comparator: this.numberComparator },
    { name: "Bank Status", prop: "bank_status" },
    { name: "Reason", prop: "bankRejectionReason" },

    { name: "Offer Status", prop: "offer_status" },
    { name: "Date", prop: "date", comparator: this.dateComparator },
    { name: "Time", prop: "time" },
    //   { name: "Transaction ID", prop: "transaction_id" },
    { name: "Reference", prop: "_id" },
  ];
  ColumnMode = ColumnMode.force;
  reloadHoverClass: string;
  users: ClientUserModel[] = [];
  units: UnitModel[] = [];
  displayedColumns = [
    "bp",
    "project_name",
    "ru_old_no",
    "transfer_id",
    "transfer_date",
    "customer_bank",
    "tmg_bank",
    "expected_amount",
    "paid_amount",
  ];
  sortedData: TransactionModel[];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;
  constructor(
    public permissionGuard: PermissionGuard,
    public dialog: MatDialog,
    private paymentDAO: PaymentDAOService,
    private mediaDAO: MediaDAOService,
    private decimalPipe: DecimalPipe
  ) {
    const paymentSub = this.getTransactions();
    this.subscriptionArray.push(paymentSub);
  }

  ngOnInit() {
    this.currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  fixTime(time: any) {
    let localeTime = "en-US";
    let Time = utcToZonedTime(parseJSON(time), this.currentTimeZone);
    return Time.toLocaleTimeString(localeTime, { hour12: true, hour: "2-digit", minute: "2-digit" });
  }
  getHeaderName(name: string) {
    return this.columns.filter((res) => {
      if (res.prop == name) {
        return res;
      }
    })[0].name;
  }
  getTransactions() {
    this.loading = true;
    return this.paymentDAO.getAllBankTrans().subscribe((res: TransactionModel[]) => {
      this.transactions = res;

      // Initial Sorting by Date
      res.sort((a, b) => {
        return this.dateComparator(a.transactionDate, b.transactionDate);
      });

      let tempRow = [...this.rows];
      tempRow = res.map((obj: TransactionModel) => {
        if (true) {
          this.users.push(obj.user);
          this.units.push(obj.unit);

          // Change to P for pending
          return {
            bp: obj.user.sapPartnerID ? obj.user.sapPartnerID : " — ",
            project_name: obj.unit.project_name,
            ru_old_no: obj.unit.old_unit_code ? obj.unit.old_unit_code : " — ",
            transfer_id: obj.transactionCode,
            transfer_date: obj.transferDate
              ? obj.transferDate.split("-")[2] + "/" + obj.transferDate.split("-")[1] + "/" + obj.transferDate.split("-")[0]
              : obj.transferDate,
            customer_bank: obj.bankName,
            tmg_bank: obj.tmgBank,
            expected_amount: this.decimalPipe.transform(obj.expectedAmount.toString()) + " EGP",
            paid_amount: this.decimalPipe.transform(obj.amount.toString()) + (obj.transferCurrency ? " " + obj.transferCurrency : ""),
            offer_id: obj.offerID,
            offer_status: obj.offerStatus,
            bank_status: obj.bankStatus,
            bankRejectionReason: obj.bankRejectionReason,

            date: obj.transactionDate ? obj.transactionDate.split("-").join("/") : obj.transactionDate,
            time: this.fixTime(obj.transactionDateTime),
            unit_id: obj.unit._id,
            //     transaction_id: obj.transaction_id,
            _id: obj._id, // ALWAYS KEEP THE ID LAST
          };
        }
      });
      this.rows = tempRow;
      this.dataSource = new MatTableDataSource(this.rows);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
      this.sortedData = this.transactions.slice();
    });
  }

  acceptTransaction(event, row: any) {
    event.stopPropagation();

    if (!row["offer_id"]) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: "Transaction Doesn't Have an Offer ID, It Can't Be Released.",
        },
      });
      return;
    }

    const transaction = this.transactions.find((element) => {
      return element._id == row._id;
    });

    this.subscriptionArray.push(
      this.dialog
        .open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          data: {
            type: "light",
            message: `Do you confirm releasing transaction with Offer ID: ${transaction.offerID}?`,
            showYesButton: true,
            showCancelButton: true,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res === "yes") {
            this.loading = true;

            this.subscriptionArray.push(
              this.paymentDAO.acceptTransaction(transaction._id).subscribe(
                (res) => {
                  this.getTransactions();
                },
                (err) => {
                  this.loading = false;
                  this.dialog.open(ErrorDialogComponent, {
                    data: {
                      status: 500,
                      error: "Internal Server Error",
                      message: "Something went wrong. Please try again later",
                    },
                  });
                }
              )
            );
          }
        })
    );
  }

  rejectTransactionClicked(event, row: any) {
    this.subscriptionArray.push(
      this.dialog
        .open(TransactionRejectionPopupComponent, { panelClass: "md-dialog-container", disableClose: true })
        .afterClosed()
        .subscribe((msg) => {
          if (msg) this.rejectTransaction(event, row, msg);
        })
    );
  }

  rejectTransaction(event, row: any, msg: string) {
    event.stopPropagation();
    this.loading = true;
    const transaction = this.transactions.find((element) => {
      return element._id == row._id;
    });
    this.rejectionModel.transId = transaction._id;
    this.rejectionModel.reasonMsg = msg;
    this.subscriptionArray.push(
      this.paymentDAO.rejectTransaction(this.rejectionModel).subscribe(
        (res) => {
          this.getTransactions();
        },
        (err) => {
          this.loading = false;
          this.dialog.open(ErrorDialogComponent, {
            data: {
              status: 500,
              error: "Internal Server Error",
              message: "Something went wrong. Please try again later",
            },
          });
        }
      )
    );
  }

  openDialog(event, dialogName: String, row: any) {
    event.stopPropagation(); // Prevents parent from opening extended menu
    let transaction = this.transactions.find((element) => {
      return element._id == row._id;
    });
    if (dialogName === "cardPopup") {
      if (transaction.transferSlip && transaction.transferSlip.id) {
        const bankStatus = row.bank_status ? row.bank_status.toLocaleLowerCase() : row.bank_status;
        const offerStatus = row.offer_status ? row.offer_status.toLocaleLowerCase() : row.offer_status;
        this.subscriptionArray.push(
          this.dialog
            .open(ImageViewerPopupComponent, {
              panelClass: "md-dialog-container",
              data: {
                transaction,
                imageUrl: this.mediaDAO.getMediaUrl(transaction.transferSlip.id),
                disableRelease: !row["offer_id"] || bankStatus != "approved" || offerStatus != "sold",
              },
            })
            .afterClosed()
            .subscribe((result) => {
              if (result) {
                if (result === "accept") this.acceptTransaction(event, row);
                else if (result[0] === "reject") this.rejectTransaction(event, row, result[1]);
              }
            })
        );
      }
    }
  }

  getRow(e, prop) {
    return e[prop];
  }

  setDetails(e) {
    return e;
  }

  setKeyName(e) {
    // if (e != "_id") {
    let col = this.columns.find((element) => {
      return element.prop == e;
    });
    return col.name;
    // }
    // return "_ID";
  }

  countArray(row) {
    let arrayLength = Math.ceil(row.length / 3);
    let arr = [];
    for (let i = 0; i < arrayLength; i++) {
      arr.push(3 * i);
    }
    return arr;
  }

  onDetailToggle(event) {
    // console.log("Detail Toggled", event);
  }

  onActivate(event) {
    if (event.type == "click") {
      if (event.column.prop === "bp") {
        let user;
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i]._id === event.row._id) {
            user = this.users[i];
            break;
          }
        }
        this.openBP(user);
      } else if (event.column.prop === "ru_old_no") {
        let unit;
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i]._id === event.row._id) {
            unit = this.units[i];
            break;
          }
        }
        this.openUnitDetails(unit);
      } else {
        let row = event.row;
        this.table.rowDetail.toggleExpandRow(row);
      }
    }
  }

  openBP(user?, row?) {
    this.loading = true;
    if (row) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i]._id === row._id) {
          user = this.users[i];
          break;
        }
      }
      this.openBP(user);
    } else {
      this.loading = false;
      this.dialog.open(UserDetailsPopupComponent, {
        panelClass: "md-dialog-container",
        data: { user },
      });
    }
  }

  openUnitDetails(unit?, row?) {
    this.loading = true;
    if (row) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i]._id === row._id) {
          unit = this.units[i];
          break;
        }
      }
      this.openUnitDetails(unit);
    } else {
      this.loading = false;
      this.dialog.open(UnitDetailsPopupComponent, {
        panelClass: "md-dialog-container",
        data: { unitData: unit },
      });
    }
  }

  dateComparator(valueA, valueB) {
    if (!valueA && !valueB) return 0;
    else if (!valueA) return -1;
    else if (!valueB) return 1;

    valueA = valueA.split("-").join("/");
    valueB = valueB.split("-").join("/");

    const strA = String(valueA);
    const dateA = new Date(Number(strA.split("/")[2]), Number(strA.split("/")[1]), Number(strA.split("/")[0])); // Year, Month, Day

    const strB = String(valueB);
    const dateB = new Date(Number(strB.split("/")[2]), Number(strB.split("/")[1]), Number(strB.split("/")[0])); // Year, Month, Day

    if (dateA > dateB) return 1;
    else if (dateA < dateB) return -1;
    else return 0;
  }

  numberComparator(valueA, valueB) {
    if (!valueA && !valueB) return 0;
    else if (!valueA) return -1;
    else if (!valueB) return 1;

    const numA = Number(valueA.split(" ")[0].replace(/,/gi, ""));
    const numB = Number(valueB.split(" ")[0].replace(/,/gi, ""));

    if (numA > numB) return 1;
    else if (numA < numB) return -1;
    else return 0;
  }

  onPDFClicked(event, row: any) {
    event.stopPropagation(); // Prevents parent from opening extended menu
    this.isPrintLoading = true;

    this.subscriptionArray.push(
      this.paymentDAO.print(`${row._id}/${row.unit_id}`).subscribe(
        (result) => {
          this.isPrintLoading = false;
          this.dialog.open(PDFViewerComponent, {
            panelClass: "login-md-dialog-container",
            closeOnNavigation: true,
            disableClose: true,
            data: { fileSrc: result },
          });
        },
        (error) => {
          this.isPrintLoading = false;
          this.dialog.open(AlertPopupComponent, {
            panelClass: "md-dialog-container",
            data: {
              type: "danger",
              message: "An error has occured while loading PDF file",
            },
          });
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptionArray.forEach((element) => {
      if (element) element.unsubscribe();
    });
  }
  sortData(sort: Sort) {
    const data: any[] = this.dataSource.data;
    if (!sort.active || sort.direction === "") {
      this.dataSource = new MatTableDataSource(data);
      return;
    }

    this.dataSource = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "bp":
            return this.compare(a.bp, b.bp, isAsc);
          case "project_name":
            return this.compare(a.project_name, b.project_name, isAsc);
          case "ru_old_no":
            return this.compare(a.ru_old_no, b.ru_old_no, isAsc);
          case "transfer_id":
            return this.compare(a.transfer_id, b.transfer_id, isAsc);
          case "transfer_date":
            return this.compare(a.transfer_date, b.transfer_date, isAsc);
          case "customer_bank":
            return this.compare(a.customer_bank, b.customer_bank, isAsc);
          case "tmg_bank":
            return this.compare(a.tmg_bank, b.tmg_bank, isAsc);
          case "expected_amount":
            return this.compare(a.expected_amount, b.expected_amount, isAsc);
          case "paid_amount":
            return this.compare(a.paid_amount, b.paid_amount, isAsc);
          default:
            return 0;
        }
      })
    );
  }

  compare(a: number | String, b: number | String, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
