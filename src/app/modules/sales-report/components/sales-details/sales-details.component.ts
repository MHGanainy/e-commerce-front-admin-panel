import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { TimeFunctions } from "src/app/shared/functions/time.functions";

@Component({
  selector: "app-sales-details",
  templateUrl: "./sales-details.component.html",
  styleUrls: ["./sales-details.component.scss"],
})
export class SalesDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["date", "online", "oncall", "total_accept", "total_reject"];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public timeFunctions: TimeFunctions) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.data.row.salesmanDetails);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
