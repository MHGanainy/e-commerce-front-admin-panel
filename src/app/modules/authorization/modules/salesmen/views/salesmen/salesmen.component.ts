import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { SalesmanDAOService } from "src/app/core/http/salesman-dao.service";
import { SalesmanModel } from "src/app/shared/models/Salesman.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-salesmen",
  templateUrl: "./salesmen.component.html",
  styleUrls: ["./salesmen.component.scss"],
})
export class SalesmenComponent implements OnInit {
  // tslint:disable: one-line
  isLoading = true;

  salesmen: SalesmanModel[];

  currentPage = 1;
  numOfPages: number;

  constructor(
    private salesmanDAOService: SalesmanDAOService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSalesmen();
  }

  private loadSalesmen() {
    this.salesmanDAOService.findAll().subscribe(
      (res) => {
        // this.salesmen = res.content.sort((a, b) => {
        //   if (a.email.toLowerCase() > b.email.toLowerCase()) return 1;
        //   else if (a.email.toLowerCase() < b.email.toLowerCase()) return -1;
        //   else return 0;
        // });
        this.salesmen = res.content;
        this.isLoading = false;
      },
      (error) => {
        this.matDialog.open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          data: { type: "danger", message: error && error.error ? error.error : "An error has while loading salesmen." },
        });
        this.isLoading = false;
      }
    );
  }

  getPropertyValues(salesman: SalesmanModel, property: "language" | "project") {
    return salesman.properties.find((prop) => prop.key === property).values;
  }

  onEditClicked(index: number) {
    this.router.navigate(["salesman-info"], {
      relativeTo: this.activatedRoute,
      state: this.salesmen[index],
      queryParams: { _id: this.salesmen[index]._id },
    });
  }

  onCreateNewClicked() {
    this.router.navigate(["salesman-info"], { relativeTo: this.activatedRoute });
  }
}
