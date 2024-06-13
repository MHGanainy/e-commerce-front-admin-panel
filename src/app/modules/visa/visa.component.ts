import { animate, state, style, transition, trigger } from "@angular/animations";
import { DecimalPipe } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { ColumnMode } from "@swimlane/ngx-datatable";
import { format, parseJSON } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { Subscription } from "rxjs";
import { PermissionGuard } from "src/app/core/guards/permission.guard";
import { ApiService } from "src/app/core/http/api.service";
import { PaymentDAOService } from "src/app/core/http/payment-dao.service";
import { UserDAOService } from "src/app/core/http/user-dao.service";
import { PDFViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { SuccessDialogComponent } from "src/app/shared/components/success-dialog/success-dialog.component";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { RejectionModel } from "src/app/shared/models/Rejection.model";
import { TransactionModel } from "src/app/shared/models/Transaction.model";
import { UnitModel } from "src/app/shared/models/Unit.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";
import { ErrorDialogComponent } from "src/app/shared/popup-components/error-dialog/error-dialog.component";

import { UnitDetailsPopupComponent } from "../../shared/popup-components/unit-details-popup/unit-details-popup.component";
import { UserDetailsPopupComponent } from "../../shared/popup-components/user-details-popup/user-details-popup.component";
import { ImageViewerPopupComponent } from "../approval/image-viewer-popup/image-viewer-popup.component";

declare var $: any;

@Component({
  selector: "app-visa",
  templateUrl: "./visa.component.html",
  styleUrls: ["./visa.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class VisaComponent implements OnInit, OnDestroy {
  @ViewChild("myTable") table: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  transactions: TransactionModel[] = [];
  loading = true;
  isPrintLoading: boolean;
  rejectionModel = new RejectionModel();
  objectKeys = Object.keys;
  subscriptionArray: Subscription[] = [];
  rows = [];
  panelOpenState = false;
  columns = [
    { name: "BP", prop: "bp", comparator: this.numberComparator },
    { name: "Project Name", prop: "project_name" },
    { name: "Old Unit Code", prop: "ru_old_no" },
    { name: "Amount", prop: "amount", comparator: this.numberComparator },
    { name: "Offer ID", prop: "offer_id", comparator: this.numberComparator },
    { name: "Offer Status", prop: "offer_status" },
    { name: "Date", prop: "date", comparator: this.dateComparator },
    { name: "Time", prop: "time" },
    // { name: "Print Approval Status", prop: "printApprovalStatus" },
    //   { name: "Transaction ID", prop: "transaction_id" },
    { name: "Reference", prop: "_id" },
  ];
  displayedColumns = ["bp", "project_name", "ru_old_no", "amount", "offer_id", "offer_status", "date", "time"];
  ColumnMode = ColumnMode.force;
  reloadHoverClass: string;
  users: ClientUserModel[] = [];
  units: UnitModel[] = [];
  currentTimeZone: string;
  sortedData: TransactionModel[];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  constructor(
    public permissionGuard: PermissionGuard,
    public dialog: MatDialog,
    private paymentDAO: PaymentDAOService,
    private decimalPipe: DecimalPipe,
    private userDaoService: UserDAOService
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
    // Page Size = 999,999,999
    this.loading = true;

    return this.paymentDAO.getAllVisaTrans(999999999, 0, "transactionDate", "asc").subscribe((res: any) => {
      const content = res.content as TransactionModel[];

      for (let i = 0; i < content.length; ) {
        if (!content[i].user || !content[i].unit) content.splice(i, 1);
        else i++;
      }
      // Initial Sorting by Date
      content.sort((a, b) => {
        return this.dateComparator(a.transactionDate, b.transactionDate);
      });

      this.transactions = content;
      let tempRow = [...this.rows];
      tempRow = content.map((obj: TransactionModel) => {
        this.users.push(obj.user);
        this.units.push(obj.unit);

        return {
          bp: obj.user.sapPartnerID ? obj.user.sapPartnerID : " — ",
          project_name: obj.unit.project_name,
          ru_old_no: obj.unit.old_unit_code ? obj.unit.old_unit_code : " — ",
          amount: this.decimalPipe.transform(obj.amount.toString()) + (obj.currency ? " " + obj.currency : ""),
          offer_id: obj.offerID,
          offer_status: obj.offerStatus?obj.offerStatus:'not completed',
          date: obj.transactionDate
            ? format(utcToZonedTime(parseJSON(obj.transactionDateTime), this.currentTimeZone), "dd/MM/yyyy")
            : obj.transactionDate,
          time: this.fixTime(obj.transactionDateTime),
          unit_id: obj.unit._id,
          status: obj.printApprovalStatus,
          user: obj.user,
          unit: obj.unit,
          // transaction_id: obj.transaction_id,
          _id: obj._id, // ALWAYS KEEP THE ID LAST
        };
      });
      this.rows = tempRow;
      this.dataSource = new MatTableDataSource(this.rows);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
      this.sortedData = this.transactions.slice();
    });
  }

  openUserOrUnit(event: MouseEvent, columnName: string, obj: TransactionModel) {
    if (columnName == "bp") {
      event.stopPropagation();
      this.openBP(obj.user);
    }
    if (columnName == "ru_old_no") {
      event.stopPropagation();
      this.openUnitDetails(obj.unit);
    }
  }

  acceptTransaction(event, row: any) {
    event.stopPropagation();

    if (!row.offer_id) {
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
              this.paymentDAO.acceptPrintApproval(transaction._id).subscribe(
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
        // this.openBP(user);
      } else if (event.column.prop === "ru_old_no") {
        let unit;
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i]._id === event.row._id) {
            unit = this.units[i];
            break;
          }
        }
        //this.openUnitDetails(unit);
      } else {
        let row = event.row;
        this.table.rowDetail.toggleExpandRow(row);
      }
    }
  }

  openBP(user: any) {
    event.stopPropagation();
    this.loading = true;

    this.dialog
      .open(UserDetailsPopupComponent, {
        disableClose: true,
        panelClass: "md-dialog-container",
        data: { user },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == "updated") {
          this.getTransactions();
        }
      });
    this.loading = false;
  }

  openUnitDetails(unit: any) {
    event.stopPropagation();
    this.loading = true;

    this.dialog.open(UnitDetailsPopupComponent, {
      panelClass: "md-dialog-container",
      data: { unitData: unit },
    });
    this.loading = false;
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
      this.paymentDAO.print(`${row._id}/${row.unit._id}`).subscribe(
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
          case "amount":
            return this.compare(a.amount, b.amount, isAsc);
          case "offer_id":
            return this.compare(a.offer_id, b.offer_id, isAsc);
          case "offer_status":
            return this.compare(a.offer_status, b.offer_status, isAsc);
          case "date":
            return this.compare(a.date, b.date, isAsc);
          case "time":
            return this.compare(a.time, b.time, isAsc);
          default:
            return 0;
        }
      })
    );
  }

  compare(a: number | String, b: number | String, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  viewID(element: TransactionModel) {
    this.dialog.open(ImageViewerPopupComponent, {
      panelClass: "md-dialog-container",
      data: {
        imageUrl: this.userDaoService.viewId(element.user._id),
        button: false,
      },
    });
  }

  updateSAP(element: TransactionModel) {
    this.loading = true;
    this.paymentDAO.updateSAP(element.user).subscribe(
      (res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          data: {
            message: "Updated Customer Data Successfully",
          },
        });
      },
      (err) => {
        this.loading = false;
        console.error(err);
      }
    );
  }
  printApprovalStatus() {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        message: "test.",
      },
    });
  }
}
