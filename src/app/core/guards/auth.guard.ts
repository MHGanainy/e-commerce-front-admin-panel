import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

import { AuthService } from "../auth/auth.service";
import { UserDAOService } from "../http/user-dao.service";
import { UserDataService } from "../services/user-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
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
      if (this.userDataService.userData) {
        resolve(true);
      }
      this.userDAO.getUser().subscribe(
        (r) => {
          resolve(true);
        },
        (err) => {
          try {
            this.matDialog.open(AlertPopupComponent, {
              panelClass: "md-dialog-container",
              id: "unauthorizedMatDialog",
              data: { type: "danger", message: "You don't have permission to view this page.", showButton: true },
            });
          } catch (error) {
            console.log(error);
          }

          reject(err);
          this.router.navigateByUrl("login");
        }
      );
    });
  }
}
