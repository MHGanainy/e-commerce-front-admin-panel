import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { AuthService } from "../auth/auth.service";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { UserDAOService } from "../http/user-dao.service";
import { UserDataService } from "../services/user-data.service";
import { UserModel } from "src/app/shared/models/User.model";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userDAO: UserDAOService,
    private userDataService: UserDataService,
    public matDialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>((resolve, reject) => {
      if (this.userDataService.userData && this.userDataService.userData === UserModel) {
        this.router.navigateByUrl("home");
        resolve(true);
      }
      this.userDAO.getUser().subscribe(
        (r) => {
          this.router.navigateByUrl("home");
          resolve(true);
        },
        (err) => {
          resolve(true);
        }
      );
    });
  }
}
