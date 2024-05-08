import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { format } from "date-fns";
import { LogsDAOService } from "src/app/core/http/logs-dao.service";
import { SalesmanDAOService } from "src/app/core/http/salesman-dao.service";
import { TimeFunctions } from "src/app/shared/functions/time.functions";
import { LogsModel } from "src/app/shared/models/Logs.model";
import { SalesmanModel } from "src/app/shared/models/Salesman.model";

import { SalesDetailsComponent } from "./components/sales-details/sales-details.component";

@Component({
  selector: "app-sales-report",
  templateUrl: "./sales-report.component.html",
  styleUrls: ["./sales-report.component.scss"],
})
export class SalesReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  picker: any;
  selectedSalesAgent: String = null;
  salesAgentSearch = new FormGroup({
    sales_agent_id: new FormControl(null),
    dateFrom: new FormControl(new Date()),
    dateTo: new FormControl(new Date()),
  });
  salesAgents: any[];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["ID", "total_online_time", "total_away_time", "total_accept", "total_reject"];
  loading: boolean = false;
  pageIndex: any;
  pageSize: any;
  length: number;
  constructor(
    private logsDAO: LogsDAOService,
    private salesDAO: SalesmanDAOService,
    private dialog: MatDialog,
    public timeFunctions: TimeFunctions
  ) {}

  ngOnInit() {
    this.salesDAO.getAll().subscribe((res: SalesmanModel[]) => {
      this.salesAgents = res;
    });
  }

  onSearchClicked() {
    this.loading = true;
    this.dataSource = null;
    let logsObj = new LogsModel();
    logsObj.sales_id = this.salesAgentSearch.value["sales_agent_id"] == "null" ? null : this.salesAgentSearch.value["sales_agent_id"];
    logsObj.salesmanId = this.salesAgentSearch.value["sales_agent_id"] == "null" ? null : this.salesAgentSearch.value["sales_agent_id"];
    logsObj.localDateFrom = format(this.salesAgentSearch.value["dateFrom"], "yyyy-MM-dd");
    logsObj.localDateTo = format(this.salesAgentSearch.value["dateTo"], "yyyy-MM-dd");
    let filter = {};

    this.logsDAO.find(logsObj, 100, 0, "_id", "desc", filter).subscribe(
      (res) => {
        this.loading = false;
        this.dataSource = new MatTableDataSource<any>(res.content);
        this.dataSource.paginator = this.paginator;
        // this.paginator.length = res.totalElements;
        // this.length = res.totalElements;
        // this.pageIndex = 0;
        // this.pageSize = 5;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
  getData(e) {
    // this.loading = true;
    // this.dataSource = null;
    // let filter = {
    //   salesmanId: this.salesAgentSearch.value["sales_agent_id"] == "null" ? null : this.salesAgentSearch.value["sales_agent_id"],
    //   localDateFrom: format(this.salesAgentSearch.value["dateFrom"], "yyyy-MM-dd"),
    //   localDateTo: format(this.salesAgentSearch.value["dateTo"], "yyyy-MM-dd"),
    // };
    // let logsObj = new LogsModel();
    // logsObj.sales_id = this.salesAgentSearch.value["sales_agent_id"] == "null" ? null : this.salesAgentSearch.value["sales_agent_id"];
    // logsObj.salesmanId = this.salesAgentSearch.value["sales_agent_id"] == "null" ? null : this.salesAgentSearch.value["sales_agent_id"];
    // logsObj.localDateFrom = format(this.salesAgentSearch.value["dateFrom"], "yyyy-MM-dd");
    // logsObj.localDateTo = format(this.salesAgentSearch.value["dateTo"], "yyyy-MM-dd");
    // this.logsDAO.find(logsObj, e.pageSize, e.pageIndex, "_id", "desc", filter).subscribe(
    //   (res) => {
    //     this.loading = false;
    //     this.dataSource = new MatTableDataSource<any>(res.content);
    //     this.paginator.length = res.totalElements;
    //     this.length = res.totalElements;
    //     this.pageIndex = e.pageIndex;
    //     this.pageSize = e.pageSize;
    //   },
    //   (err) => {
    //     this.loading = false;
    //   }
    // );
  }
  openRecord(row) {
    this.dialog.open(SalesDetailsComponent, {
      panelClass: "sales-details-container",
      data: {
        row,
      },
    });
  }
}
