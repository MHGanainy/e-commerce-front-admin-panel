import { HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { format } from "date-fns";
import { AppointmentHistoryDAOService } from "src/app/core/http/appointment-history-dao.service";
import { SalesmanDAOService } from "src/app/core/http/salesman-dao.service";
import { TimeFunctions } from "src/app/shared/functions/time.functions";
import { SalesmanModel } from "src/app/shared/models/Salesman.model";

@Component({
  selector: "app-appointment-history",
  templateUrl: "./appointment-history.component.html",
  styleUrls: ["./appointment-history.component.scss"],
})
export class AppointmentHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  picker: any;
  appointmentHistory = new FormGroup({
    sales_agent_id: new FormControl(null),
    project_id: new FormControl(null),
    SalesCylce_id: new FormControl(null),
    dateFrom: new FormControl(new Date()),
    dateTo: new FormControl(new Date()),
  });
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "country",
    "apppointmentDate",
    "customerSAP",
    "customerName",
    "customerMobile",
    "project",
    "salesman",
    "salesPhase",
    "utmSource",
    "note",
  ];
  loading: boolean = false;
  pageIndex: any;
  pageSize: any;
  length: number;
  localDateFrom;
  localDateTo;
  salesAgents: any[];
  constructor(
    private appointmentHistoryDAOService: AppointmentHistoryDAOService,
    public timeFunctions: TimeFunctions,
    private salesDAO: SalesmanDAOService
  ) {
    this.salesDAO.getAll().subscribe((res: SalesmanModel[]) => {
      this.salesAgents = res;
    });
  }

  ngOnInit() {}

  onSearchClicked() {
    this.loading = true;
    this.dataSource = null;
    this.localDateFrom = new Date(this.appointmentHistory.value["dateFrom"]).toISOString();
    this.localDateTo = new Date(this.appointmentHistory.value["dateTo"]).toISOString();
    let filter = {};

    this.appointmentHistoryDAOService
      .getAppointmentHistory({
        startDate: this.localDateFrom,
        endDate: this.localDateTo,
        project: this.appointmentHistory.value["project_id"] == "null" ? null : this.appointmentHistory.value["project_id"],
        salesCycle: this.appointmentHistory.value["SalesCylce_id"] == "null" ? null : this.appointmentHistory.value["SalesCylce_id"],
        salesMan: this.appointmentHistory.value["sales_agent_id"] == "null" ? null : this.appointmentHistory.value["sales_agent_id"],
      })
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.dataSource = new MatTableDataSource<any>(res);
          this.dataSource.paginator = this.paginator;
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  exportExcel() {
    this.localDateFrom = new Date(this.appointmentHistory.value["dateFrom"]).toISOString().slice(0, -1);
    this.localDateTo = new Date(this.appointmentHistory.value["dateTo"]).toISOString().slice(0, -1);
    const params = new HttpParams()
      .set("startDate", this.localDateFrom)
      .set("endDate", this.localDateTo)
      .set("project", this.appointmentHistory.value["project_id"] == "null" ? null : this.appointmentHistory.value["project_id"])
      .set("salesCycle", this.appointmentHistory.value["SalesCylce_id"] == "null" ? null : this.appointmentHistory.value["SalesCylce_id"])
      .set(
        "salesManId",
        this.appointmentHistory.value["sales_agent_id"] == "null" ? null : this.appointmentHistory.value["sales_agent_id"]
      );
    this.appointmentHistoryDAOService.exportToExcel(params).subscribe((res: { file: any; filename: any }) => {
      let a = document.createElement("a");

      a.style.display = "none";

      let url = window.URL.createObjectURL(res.file);

      let realFilename = res.filename?.split("=")[1];

      a.href = url;

      a.download = realFilename || "file";

      document.body.appendChild(a);

      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);

        document.body.removeChild(a);
      }, 0);
    });
  }
}
