import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { format } from "date-fns";
import { UserDAOService } from "src/app/core/http/user-dao.service";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { ErrorDialogComponent } from "src/app/shared/popup-components/error-dialog/error-dialog.component";

@Component({
  selector: "app-find-utm",
  templateUrl: "./find-utm.component.html",
  styleUrls: ["./find-utm.component.scss"],
})
export class FindUtmComponent implements OnInit {
  displayedColumns = ["UTM_medium", "UTM_source", "Count"];
  reloadHoverClass: string;
  dataSource: MatTableDataSource<any>;
  loading = false;
  startdate: string;
  enddate: string;
  utmFinder = new FormGroup({
    dateFrom: new FormControl(new Date()),
    dateTo: new FormControl(new Date()),
  });
  @ViewChild(MatSort) sort: MatSort;
  constructor(private userDAOService: UserDAOService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  findUTM() {
    this.startdate = format(this.utmFinder.value["dateFrom"], "yyyy-MM-dd");
    this.enddate = format(this.utmFinder.value["dateTo"], "yyyy-MM-dd");
    this.loading = true;
    this.userDAOService.findUTM(this.startdate, this.enddate).subscribe(
      (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.loading = false;
        console.log(res);
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
}
