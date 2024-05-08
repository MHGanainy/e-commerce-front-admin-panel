import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { UserModel } from "src/app/shared/models/User.model";

import { UserDAOService } from "../http/user-dao.service";
import { ErrorDialogService } from "../services/error-dialog.service";
import { UserDataService } from "../services/user-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private userDao: UserDAOService,
    private userDataServ: UserDataService,
    private errorDialogService: ErrorDialogService,
    private router: Router
  ) {}

  logIn(user: UserModel) {
    this.userDao.login(user).subscribe(
      (res) => {
        this.userDataServ.setSaveUserDataObs(res);
        localStorage.setItem("userState", "true");
        this.router.navigateByUrl("home");
      },
      (err) => {
        this.errorDialogService.openDialog({
          message: err.error,
        });
      }
    );
  }

  logOut() {
    this.userDao.logout().subscribe((res) => {
      localStorage.removeItem("userState");
      this.userDataServ.setSaveUserDataObs(null);
    });
  }
}
