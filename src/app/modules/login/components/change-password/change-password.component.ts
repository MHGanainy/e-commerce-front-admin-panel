import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { UserDAOService } from "src/app/core/http/user-dao.service";
import { SuccessDialogComponent } from "src/app/shared/components/success-dialog/success-dialog.component";
import { UserModel } from "src/app/shared/models/User.model";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  passwordChange = new FormGroup(
    {
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      newP: new FormControl("", Validators.required),
      renewP: new FormControl("", Validators.required),
    },
    { validators: checkPasswordMatch }
  );

  loading: boolean = false;
  errorChanging: string;
  passwordCorrection: string;

  constructor(private userDAO: UserDAOService, private dialog: MatDialog, private dialogRef: MatDialogRef<ChangePasswordComponent>) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.passwordChange.valid) {
      let user = new UserModel();
      user.username = this.passwordChange.value["username"];
      user.email =  this.passwordChange.value["username"];
      user.password = this.passwordChange.value["password"];
      this.userDAO.changePassword(user, this.passwordChange.value["newP"]).subscribe(
        (res) => {
          console.log(res, "password changed");
          this.dialog
            .open(SuccessDialogComponent, {
              data: {
                message: "Password Changed",
              },
            })
            .afterClosed()
            .subscribe((res) => {
              this.dialogRef.close();
            });
        },
        (err) => {
          this.loading = false;
          if ((err.error as string).toLocaleLowerCase().includes("password is not correct")) {
            this.passwordCorrection = err.error;
          } else {
            this.errorChanging = err.error;
          }
        }
      );
    }

    console.log(this.passwordChange);
  }
}

const checkPasswordMatch = (c: FormGroup): ValidationErrors | null => {
  const z = c.get("newP");
  const a = c.get("renewP");

  return z && a && a.value !== z.value ? { passwordNotEqual: true, message: "Password does not match" } : null;
};
