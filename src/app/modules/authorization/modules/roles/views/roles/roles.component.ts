import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";
import { CreateRoleComponent } from "../../components/create-role/create-role.component";
import { MatDialog } from "@angular/material/dialog";
import { RoleDAOService } from "src/app/core/http/role-dao.service";
import { RoleModel } from "src/app/shared/models/Role.model";
import { UserDAOService } from "src/app/core/http/user-dao.service";
import { UserModel } from "src/app/shared/models/User.model";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  isRolesLoading = true;
  isUsersLoading = true;

  currentTab: "permissions" | "users" = "permissions";

  rolesArr: RoleModel[];
  selectedRole: RoleModel;

  usersArr: UserModel[];

  constructor(
    // private router: Router,
    // private activatedRoute: ActivatedRoute,
    private roleDAOService: RoleDAOService,
    private userDAOService: UserDAOService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles() {
    this.roleDAOService.getAllRoles().subscribe((res) => {
      this.rolesArr = res;
      // // Testing if permissions table overflows
      // for (let i = 0; i < 50; i++) this.rolesArr[0].permissions.push(this.rolesArr[0].permissions[0]);
      this.isRolesLoading = false;
    });

    this.userDAOService.getAllUsers().subscribe((res) => {
      this.usersArr = res;
      // // Testing if roles table overflows
      // for (let i = 0; i < 50; i++) {
      //   this.users[0].roles.push(this.users[0].roles[0]);
      // }
      this.isUsersLoading = false;
    });
  }

  onRoleClicked(index: number) {
    if (this.rolesArr[index] === this.selectedRole) return;

    this.selectedRole = this.rolesArr[index];
  }

  createRole() {
    // this.router.navigate(["create"], { relativeTo: this.activatedRoute });

    this.matDialog
      .open(CreateRoleComponent, {
        panelClass: "md-dialog-container",
        id: "create-new-role-dialog",
        disableClose: true,
        closeOnNavigation: true,
      })
      .afterClosed()
      .subscribe((newRole) => {
        if (newRole) {
          this.isRolesLoading = true;

          this.roleDAOService.createOne(newRole).subscribe((res) => {
            this.isRolesLoading = false;

            this.matDialog
              .open(AlertPopupComponent, {
                panelClass: "md-dialog-container",
                id: "new-role-created-success-dialog",
                data: { type: "success", message: "New role created successfully. You can now asign role Permissions and Users." },
              })
              .afterClosed()
              .subscribe(() => {
                this.rolesArr.push(res);
                this.selectedRole = res;

                this.currentTab = "permissions";
                this.adjustCurrentTab();
              });
          });
        }
      });
  }

  private adjustCurrentTab() {
    try {
      if (this.currentTab === "permissions") document.getElementById("role-perms-tab").click();
      else if (this.currentTab === "users") document.getElementById("role-users-tab").click();
    } catch (error) {
      if (error.message === "Cannot read property 'click' of null" || error.message === "Cannot read property 'click' of undefined")
        setTimeout(() => {
          this.adjustCurrentTab();
        }, 100);
      else console.log(error);
    }
  }

  async saveAll() {
    this.isUsersLoading = true;
    this.isRolesLoading = true;

    // Sending updated user data to backend
    this.userDAOService.updateUsers(this.usersArr).subscribe((res) => {
      this.usersArr = res;
      this.isUsersLoading = false;
    });

    // Sending updated roles data to backend
    const tempRolesArr = [];
    for (const role of this.rolesArr) {
      const updatedRole = await this.roleDAOService.updateRole(role).toPromise();
      tempRolesArr.push(updatedRole);
    }
    this.rolesArr = tempRolesArr;

    // Setting new selectedRole object, as old value reference is still in memeory, but is no longer in the array
    if (this.selectedRole) this.selectedRole = this.rolesArr.find((role) => this.selectedRole._id === role._id);

    this.isRolesLoading = false;

    this.matDialog
      .open(AlertPopupComponent, {
        panelClass: "md-dialog-container",
        id: "roles-updated-success-dialog",
        data: { type: "success", message: "Roles data updated successfully." },
      })
      .afterClosed()
      .subscribe(() => this.adjustCurrentTab());
  }
}
