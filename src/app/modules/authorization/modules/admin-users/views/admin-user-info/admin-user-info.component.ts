import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModel } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { UserDAOService } from "src/app/core/http/user-dao.service";
import { ValidationFunctions } from "src/app/shared/functions/validation.functions";
import { UserModel } from "src/app/shared/models/User.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

class TempUserModel extends UserModel {
  confirmPassword: string;

  constructor() {
    super();
  }
}

@Component({
  selector: "app-registration",
  templateUrl: "./admin-user-info.component.html",
  styleUrls: ["./admin-user-info.component.scss"],
})
export class AdminUserInfoComponent implements OnInit {
  // tslint:disable: one-line
  @ViewChild("email") email: NgModel;

  isLoading = false;

  type: "edit" | "new";

  errorMsg: string;
  emailErrorMsg: string;
  passwordErrorMsg: string;

  user = new TempUserModel();

  constructor(
    private userDAOService: UserDAOService,
    private validateFns: ValidationFunctions,
    private matDialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Getting route's state
    // Use something like this to set the route's state: this.router.navigateByUrl('/dynamic', { state: { id:1 , name:'Angular' } });
    const user = this.location.getState() as UserModel;
    if (user && user.email) {
      this.type = "edit";
      this.setUserData(user);
    } else {
      // this.isLoading = true;
      // this.activatedRoute.queryParams.subscribe(
      //   (params) => {
      //     if (params && params._id) {
      //       // this.userDAOService.findOne({ _id: params._id } as UserModel).subscribe(
      //       //   (res) => {
      //       //     this.type = "edit";
      //       //     this.setUserData(res.content[0]);
      //       //     this.isLoading = false;
      //       //   },
      //       //   (error) => {
      //       //     this.type = "new";
      //       //     this.isLoading = false;
      //       //   }
      //       // );
      //     } else {
      //       this.type = "new";
      //       this.isLoading = false;
      //     }
      //   },
      //   (error) => {
      //     this.type = "new";
      //     this.isLoading = false;
      //   }
      // );

      this.type = "new";
      this.isLoading = false;
    }
  }

  private setUserData(user: UserModel) {
    this.user = user as TempUserModel;

    // setting confirm password value to password
    this.user.confirmPassword = this.user.password;
  }

  onSubmit() {
    this.isLoading = true;

    // Init error messages
    let isFormValid = true;
    this.errorMsg = null;
    this.emailErrorMsg = null;
    this.passwordErrorMsg = null;

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

    // Validating passwords
    if (this.type === "new" || this.user.password) {
      // Checking both password and confirm password fields have value
      if (!(this.user.password && this.user.confirmPassword)) {
        if (!this.user.password) document.getElementById("RGpassword").classList.add("is-invalid");
        else document.getElementById("RGpassword").classList.remove("is-invalid");

        if (!this.user.confirmPassword) document.getElementById("RGconfirmPassword").classList.add("is-invalid");
        else document.getElementById("RGconfirmPassword").classList.remove("is-invalid");

        isFormValid = false;
      }
      // checking if password and confirm password fields are a match
      else if (!this.validateFns.checkPasswordMatch(this.user.password, this.user.confirmPassword, "RGpassword", "RGconfirmPassword")) {
        this.passwordErrorMsg = "Password and Confirm Passwrod Fields Do Not Match";
        isFormValid = false;
      }
    }

    // Checking remaining fields are not empty
    if (!this.validateFns.validate(["RGfirstName", "RGlastName", "RGmobile"], this.user, "RG")) isFormValid = false;

    if (isFormValid) {
      // delete this.newUser.confirmPassword;
      // console.log(this.newUser);
      // this._userAPI.createOne(this.user).subscribe(
      //   (res) => {
      //     this.userDataServ.setSaveUserDataObs(res);
      //     localStorage.setItem("userState", "true");
      //     this.router.navigateByUrl("home");
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );

      // Show Success Message
      // this.newUser= new TempUserModel()

      const confirmPassword = this.user.confirmPassword;
      const originalEmailValue = this.user.email;

      delete this.user.confirmPassword;
      this.user.email = this.user.email.toLowerCase();

      if (this.type === "new")
        this.userDAOService.createOne(this.user).subscribe(
          (res) => {
            this.isLoading = false;

            this.router.navigateByUrl(`authorization/admin-users?_id=${(res as any)._id}`);

            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              data: { type: "success", message: `New admin user "${this.user.email}" created successfully.` },
            });
          },
          (err) => {
            console.log(err);
            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              data: { type: "danger", message: err && err.error ? err.error : "An error has occurred while creating new user." },
            });
            this.isLoading = false;
          }
        );
      else
        this.userDAOService.updateUser(this.user).subscribe(
          (res) => {
            this.isLoading = false;
            this.router.navigateByUrl(`authorization/salesmen`);
            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              data: { type: "success", message: `User "${this.user.email}" was edited successfully.` },
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

      this.user.email = originalEmailValue;
      this.user.confirmPassword = confirmPassword;
    } else {
      this.errorMsg = "Please fill in all required fields";
      this.isLoading = false;
    }
  }
}
