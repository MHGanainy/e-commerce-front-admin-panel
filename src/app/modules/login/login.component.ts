import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "src/app/core/auth/auth.service";
import { UserModel } from "src/app/shared/models/User.model";

import { ChangePasswordComponent } from "./components/change-password/change-password.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginFailed = false;
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {}

  submitLoginForm(form: NgForm) {
    const user = new UserModel();
    user.email = (form.controls.username.value as string).toLowerCase();
    user.password = form.controls.password.value;
    this.authService.logIn(user);
  }

  changePassword() {
    this.dialog.open(ChangePasswordComponent, {});
  }

  logOut() {
    this.authService.logOut();
  }
}
