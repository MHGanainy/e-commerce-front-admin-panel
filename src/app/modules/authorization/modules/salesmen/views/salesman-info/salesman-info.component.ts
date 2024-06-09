import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModel } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { SalesmanDAOService } from "src/app/core/http/salesman-dao.service";
import { ValidationFunctions } from "src/app/shared/functions/validation.functions";
import { SalesmanModel } from "src/app/shared/models/Salesman.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

class TempSalesmanModel extends SalesmanModel {
  confirmPassword: string;
  constructor() {
    super();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-salesman-info",
  templateUrl: "./salesman-info.component.html",
  styleUrls: ["./salesman-info.component.scss"],
})
export class SalesmanInfoComponent implements OnInit {
  // tslint:disable: one-line
  @ViewChild("email") email: NgModel;

  isLoading = false;

  type: "edit" | "new";

  fullName: string;
  fullNameErrorMsg: string;
  emailErrorMsg: string;
  passwordErrorMsg: string;
  errorMsg: string;

  salesman = new TempSalesmanModel();
  deactivate: boolean;
  dropdownSettings = {
    // selectAllText: "Select All",
    // unSelectAllText: "UnSelect All",
    // enableCheckAll: true,
    enableCheckAll: false,
    enableSearchFilter: false,
    singleSelection: false,
    classes: "form-control h-100",
  };

  // Lang dropdown related variables
  langDropdownList: { id: string; itemName: string }[] = [
    { id: "ar", itemName: "Arabic" },
    { id: "en", itemName: "English" },
  ];
  selectedLangs: { id: string; itemName: string }[] = [];
  langDropdownSettings;

  // Projects dropdown related variables
  projectsDropdownList: { id: string; itemName: string }[] = [
    { id: "celia", itemName: "Celia" },
    { id: "madinaty", itemName: "Madinaty" },
    { id: "privado", itemName: "Privado" },
    { id: "noor", itemName: "Noor" },
    { id: "southmed", itemName: "South Med" },
  ];
  selectedProjects: { id: string; itemName: string }[] = [];
  projectsDropdownSettings;

  constructor(
    private salesmanDAOService: SalesmanDAOService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private validateFns: ValidationFunctions,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.deactivate = this.salesman.deActivate;
    this.langDropdownSettings = { ...this.dropdownSettings, text: "Select Languages" };
    this.projectsDropdownSettings = { ...this.dropdownSettings, text: "Select Projects" };

    // Getting route's state
    // Use something like this to set the route's state: this.router.navigateByUrl('/dynamic', { state: { id:1 , name:'Angular' } });
    const salesman = this.location.getState() as SalesmanModel;

    if (salesman && salesman.email) {
      this.type = "edit";
      this.setSalesmanData(salesman);
    } else {
      this.isLoading = true;
      this.activatedRoute.queryParams.subscribe(
        (params) => {
          if (params && params._id) {
            this.salesmanDAOService.findOne({ _id: params._id } as SalesmanModel).subscribe(
              (res) => {
                this.type = "edit";
                this.setSalesmanData(res.content[0]);
                this.isLoading = false;
              },
              (error) => {
                this.type = "new";
                this.isLoading = false;
              }
            );
          } else {
            this.type = "new";
            this.isLoading = false;
          }
        },
        (error) => {
          this.type = "new";
          this.isLoading = false;
        }
      );
    }
  }

  private setSalesmanData(salesman: SalesmanModel) {
    this.salesman = salesman as TempSalesmanModel;

    // Setting fullName value
    this.fullName = this.salesman.firstName + " " + this.salesman.lastName;

    // Setting selected langs
    const selectedLangs = this.salesman.properties.find((obj) => obj.key === "language").values;
    for (const lang of selectedLangs) this.selectedLangs.push({ ...this.langDropdownList.find((obj) => obj.id === lang) });

    // Setting selected projects
    const selectedProjects = this.salesman.properties.find((obj) => obj.key === "project").values;
    for (const project of selectedProjects) this.selectedProjects.push({ ...this.projectsDropdownList.find((obj) => obj.id === project) });

    // setting confirm password value to password
    this.salesman.confirmPassword = this.salesman.password;
  }

  onSubmit(navigate = false) {
    this.isLoading = true;

    // Init error messages
    let isFormValid = true;
    this.errorMsg = null;
    this.fullNameErrorMsg = null;
    this.emailErrorMsg = null;
    this.passwordErrorMsg = null;

    // Full Name Verification
    if (!this.fullName || !this.fullName.split(" ")[1]) {
      this.fullNameErrorMsg = "Please enter a valid full name separated by spaces.";
      document.getElementById("RGfullName").classList.add("is-invalid");
      isFormValid = false;
    } else {
      this.salesman.firstName = this.fullName.split(" ")[0].trim();
      this.salesman.lastName = "";
      for (let i = 1; i < this.fullName.split(" ").length; i++) this.salesman.lastName += " " + this.fullName.split(" ")[i];
      this.salesman.lastName = this.salesman.lastName.substr(1).trim();
      document.getElementById("RGfullName").classList.remove("is-invalid");
    }

    // Email validation
    // If email field is empty
    if (!this.email.value) {
      this.emailErrorMsg = "Email Field Can't Be Empty";
      document.getElementById("RGemail").classList.add("is-invalid");
      isFormValid = false;
    }
    // If email field has an incorrect value
    else if (this.email.errors) {
      this.emailErrorMsg = "Please Enter a Valid Email";
      document.getElementById("RGemail").classList.add("is-invalid");
      isFormValid = false;
    }
    // Else, email is valid
    else document.getElementById("RGemail").classList.remove("is-invalid");

    // Validating Properties
    this.salesman.properties = [];
    // Validating Languages
    if (!this.selectedLangs.length) {
      document.getElementById("RGlanguages").classList.add("is-invalid");
      isFormValid = false;
    }
    // Else, At least 1 language is selected
    else {
      document.getElementById("RGlanguages").classList.remove("is-invalid");
      this.salesman.properties.push({ key: "language", values: this.selectedLangs.map((obj) => obj.id) });
    }

    // Validating Projects
    if (!this.selectedProjects.length) {
      document.getElementById("RGprojects").classList.add("is-invalid");
      isFormValid = false;
    }
    // Else, At least 1 project is selected
    else {
      document.getElementById("RGprojects").classList.remove("is-invalid");
      this.salesman.properties.push({ key: "project", values: this.selectedProjects.map((obj) => obj.id) });
    }

    // Validating passwords
    if (this.type === "new" || this.salesman.password) {
      // Checking both password and confirm password fields have value
      if (!(this.salesman.password && this.salesman.confirmPassword)) {
        if (!this.salesman.password) document.getElementById("RGpassword").classList.add("is-invalid");
        else document.getElementById("RGpassword").classList.remove("is-invalid");

        if (!this.salesman.confirmPassword) document.getElementById("RGconfirmPassword").classList.add("is-invalid");
        else document.getElementById("RGconfirmPassword").classList.remove("is-invalid");

        isFormValid = false;
      }
      // checking if password and confirm password fields are a match
      else if (
        !this.validateFns.checkPasswordMatch(this.salesman.password, this.salesman.confirmPassword, "RGpassword", "RGconfirmPassword")
      ) {
        this.passwordErrorMsg = "Password and Confirm Passwrod Fields Do Not Match";
        isFormValid = false;
      }
    }

    // Checking remaining fields are not empty
    if (!this.validateFns.validate(["RGc4c", "RGsapemployeeNumber"], this.salesman, "RG")) isFormValid = false;

    if (isFormValid) {
      const confirmPassword = this.salesman.confirmPassword;
      const originalEmailValue = this.salesman.email;

      this.salesman.email = this.salesman.email.toLowerCase();
      delete this.salesman.confirmPassword;
      this.salesman.c4c = this.salesman.c4c.trim();
      this.salesman.sapemployeeNumber = this.salesman.sapemployeeNumber.trim();
      // this.salesman.deActivate = this.deactivate;
      if (this.type === "new")
        this.salesmanDAOService.createOne(this.salesman).subscribe(
          (res: SalesmanModel) => {
            this.isLoading = false;
            this.router.navigateByUrl(`authorization/salesmen`);
            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              data: { type: "success", message: `${this.salesman.email} added successfully.` },
            });
          },
          (err) => {
            this.isLoading = false;
            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              data: { type: "danger", message: err && err.error ? err.error : "An error has occurred while adding new salesman." },
            });
          }
        );
      else this.update(navigate);
      this.salesman.email = originalEmailValue;
      this.salesman.confirmPassword = confirmPassword;
    } else {
      this.errorMsg = "Please fill in all required fields";
      this.isLoading = false;
    }
  }
  onDelete() {
    // this.salesmanDAOService.deleteOne(this.salesman).subscribe();
    this.salesman.deActivate = this.salesman.deActivate ? !this.salesman.deActivate : true;
    this.update(true);
    // this.router.navigateByUrl("/authorization/salesmen");
  }
  update(navigate = false) {
    const confirmPassword = this.salesman.confirmPassword;
    const originalEmailValue = this.salesman.email;

    this.salesman.email = this.salesman.email.toLowerCase();
    delete this.salesman.confirmPassword;
    this.salesman.c4c = this.salesman.c4c.trim();
    this.salesman.sapemployeeNumber = this.salesman.sapemployeeNumber.trim();
    this.salesmanDAOService.update(this.salesman).subscribe(
      (res) => {
        this.isLoading = false;
        navigate && this.router.navigateByUrl(`authorization/salesmen`);
        this.matDialog.open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          data: { type: "success", message: `${this.salesman.email} was edited successfully.` },
        });
      },
      (error) => {
        this.isLoading = false;
        this.matDialog.open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          data: { type: "danger", message: error && error.error ? error.error : "An error has occurred while updating salesman data." },
        });
      }
    );
    this.salesman.email = originalEmailValue;
    this.salesman.confirmPassword = confirmPassword;
  }
}
