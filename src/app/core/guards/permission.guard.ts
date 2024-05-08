import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";
import { UserModel } from "src/app/shared/models/User.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

import { UserDAOService } from "../http/user-dao.service";
import { UserDataService } from "../services/user-data.service";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private userDAO: UserDAOService,
    private userDataService: UserDataService,
    public matDialog: MatDialog
  ) {}

  canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>((resolve, reject) => {
      let user: UserModel = this.userDataService.userData;

      if (user) this.checkPermsForCanActivate(resolve, reject, activatedRouteSnapshot, routerStateSnapshot, user);
      else
        this.userDAO.getUser().subscribe(
          (res) => {
            user = res as UserModel;
            this.checkPermsForCanActivate(resolve, reject, activatedRouteSnapshot, routerStateSnapshot, user);
          },
          (err) => {
            this.denyAccess(resolve, reject, err);
          }
        );
    });
  }

  private checkPermsForCanActivate(
    // tslint:disable-next-line: ban-types
    resolve: Function,
    // tslint:disable-next-line: ban-types
    reject: Function,
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot,
    user: UserModel
  ) {
    if (user.roles && user.roles.length) {
      const userRoles = user.roles;
      // Checking if access all permission (SH_AL) exists
      if (userRoles.find((userRole) => Boolean(userRole.role.permissions.find((perm) => perm.permission === "SH_AL")))) resolve(true);
      // Checking if a valid permission exists
      else {
        const validPerms = activatedRouteSnapshot.data.validPerms as Array<string>;
        if (validPerms) {
          let grantAccess = false;
          for (const validPerm of validPerms) {
            grantAccess = Boolean(
              userRoles.find((userRole) => Boolean(userRole.role.permissions.find((perm) => perm.permission === validPerm)))
            );
            if (grantAccess) {
              resolve(true);
              break;
            }
          }
          if (!grantAccess) this.denyAccess(resolve, reject);
        } else this.denyAccess(resolve, reject);
      }
    } else this.denyAccess(resolve, reject);
  }

  // tslint:disable-next-line: ban-types
  private denyAccess(resolve: Function, reject: Function, error?: any) {
    // Show AlertPopup
    try {
      this.matDialog.open(AlertPopupComponent, {
        panelClass: "md-dialog-container",
        id: "unauthorizedMatDialog",
        data: { type: "danger", message: "You don't have permission to view this page.", showButton: true },
      });
    } catch (error) {
      console.log(error);
    }

    // Reject or Resolve false
    if (error) reject(error);
    else resolve(false);

    // Navigate to homepage
    this.router.navigateByUrl("home");
  }

  checkPerms(validPerms?: string[]): boolean {
    const user: UserModel = this.userDataService.userData;
    if (!user || !user.roles) return false;

    const userRoles = user.roles;
    // Checking if access all permission (SH_AL) exists
    if (userRoles.find((userRole) => Boolean(userRole.role.permissions.find((perm) => perm.permission === "SH_AL")))) return true;
    // Checking if at least 1 valid permission exists
    else if (!validPerms || !validPerms.length) return false;
    else {
      let grantAccess = false;
      for (const validPerm of validPerms) {
        grantAccess = Boolean(
          userRoles.find((userRole) => Boolean(userRole.role.permissions.find((perm) => perm.permission === validPerm)))
        );
        if (grantAccess) return true;
      }
    }

    return false;
  }
}
