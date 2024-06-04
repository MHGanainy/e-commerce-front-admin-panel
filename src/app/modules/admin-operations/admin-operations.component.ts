import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { UserDAOService } from "src/app/core/http/user-dao.service";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { ErrorDialogComponent } from "src/app/shared/popup-components/error-dialog/error-dialog.component";

@Component({
  selector: "app-admin-operations",
  templateUrl: "./admin-operations.component.html",
  styleUrls: ["./admin-operations.component.scss"],
})
export class AdminOperationsComponent implements OnInit {
  displayedColumns = ["firstName", "lastName", "mobile", "update"];
  reloadHoverClass: string;
  dataSource: MatTableDataSource<any>;
  loading = false;
  isData:boolean = false
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  constructor(private userDAOService: UserDAOService, public dialog: MatDialog) {
    this.getAllWithoutSAPPartner();
  }
  updateClientUserSAP() {
    this.loading = true;
    this.userDAOService.updateClientUserSAP().subscribe(
      (res) => {
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
  getAllWithoutSAPPartner() {
    this.loading = true;
    this.userDAOService.getAllWithoutSAPPartner().subscribe(
      (res: any) => {
        console.log(res);
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.isData = true
        
        this.loading = false;
        // this.dialog.open(ErrorDialogComponent, {
        //   data: {
        //     message: "Something went wrong. Please try again later",
        //   },
        // });
      }
    );
  }
  createClientUserSAP(user: ClientUserModel) {
    this.loading = true;
    this.userDAOService.createClientUserSAP(user).subscribe(
      (res) => {
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
  ngOnInit(): void {}
}
