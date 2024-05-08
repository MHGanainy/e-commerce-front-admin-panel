import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

import { PaymentDAOService } from "src/app/core/http/payment-dao.service";
import { ClientUserModel } from "src/app/shared/models/ClientUser.model";
import { GlobalDataModel } from "src/app/shared/models/globalData.model";

import { SuccessDialogComponent } from "../../components/success-dialog/success-dialog.component";
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";

@Component({
  selector: "app-user-details-popup",
  templateUrl: "./user-details-popup.component.html",
  styleUrls: ["./user-details-popup.component.scss"],
})
export class UserDetailsPopupComponent implements OnInit, OnDestroy {
  user: ClientUserModel;
  edit: boolean = false;
  globalData: GlobalDataModel;
  countries: { cc: string; country }[];
  cities: { Code: string; City: string }[];
  states: { name: string; abbreviation: string }[];
  // Unit Properties To Display For User
  infoProperties: [any[]];
  // Rows Holding The Properties Above, Max Row Elements Count = 2
  infoRows: [any[]];
  loading = false;
  fullname;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserDetailsPopupComponent>,
    private paymentDAO: PaymentDAOService,
    public dialog: MatDialog
  ) {
    this.globalData = new GlobalDataModel();
    this.user = data.user;
    this.states = this.user.country == "CA" ? this.globalData.canadaProvinces : this.globalData.USStates;
    this.countries = this.globalData.countries_en;
    this.cities = this.globalData.cities_en;
    this.fullname = this.user.firstName + " " + this.user.lastName;
  }

  ngOnInit() {
    this.initInfoProperties();
    this.initInfoRows();
  }

  initInfoProperties() {
    // Initializing 2D Array with one Inner Empty Array
    this.infoProperties = [[]];
    // Clearing The 2D Array
    this.infoProperties.pop();

    // Filling The Array
    this.infoProperties.push(["Sap Partner ID", this.user.sapPartnerID]);
    this.infoProperties.push(["Mobile", this.user.mobile]);
    this.infoProperties.push(["First Name", this.user.firstName]);
    this.infoProperties.push(["Last Name", this.user.lastName]);
    this.infoProperties.push(["country", this.user.country]);
    this.infoProperties.push(["city", this.user.city]);
    this.infoProperties.push(["Area", this.user.region]);
    this.infoProperties.push(["State", this.user.state]);
    this.infoProperties.push(["postalCode", this.user.postalCode]);
    this.infoProperties.push(["Address", this.user.address]);
    this.infoProperties.push(["Identification ID", this.user.nationalID]);
    this.infoProperties.push(["Identification Type", this.user.identificationType == "FS0001" ? "National ID" : "Passport"]);
    // this.infoProperties.push(["City", this.user.cityDesc]);
    // this.infoProperties.push(["Country", this.user.countryDesc]);
    // this.infoProperties.push(["Area", this.user.area]);
  }

  initInfoRows() {
    // Initializing 2D Array with one Inner Empty Array
    this.infoRows = [[]];
    // Clearing The 2D Array
    this.infoRows.pop();

    // Filling The Array
    for (let i = 0; i < this.infoProperties.length; i++) {
      const element = this.infoProperties[i];
      if (i % 2 == 0) {
        this.infoRows.push([element]);
      } else {
        this.infoRows[this.infoRows.length - 1].push(element);
      }
    }

    // Deleting infoProperties From Memory as It's No Longer Needed
    delete this.infoProperties;
  }

  ngOnDestroy() {
    this.user = null;
  }

  close(type: string) {
    this.dialogRef.close(type);
  }
  onEdit() {
    this.edit = true;
  }
  onUpdate(date: any) {
    this.edit = false;
    this.fullname = this.user.firstName + " " + this.user.lastName;
    this.loading = true;
    this.paymentDAO.updateSAP(this.user).subscribe(
      (res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          data: {
            message: "Updated Customer Data Successfully",
          },
        });
        this.close("updated");
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
