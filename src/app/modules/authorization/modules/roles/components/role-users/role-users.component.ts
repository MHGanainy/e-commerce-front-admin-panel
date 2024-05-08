import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { CompanyCodeObj } from "src/app/shared/models/CompanyCode.model";
import { RoleModel } from "src/app/shared/models/Role.model";
import { UserModel } from "src/app/shared/models/User.model";
import { UserRoleModel } from "src/app/shared/models/UserRole.model";

import { AssignRoleUsersComponent } from "../assign-role-users/assign-role-users.component";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-role-users",
  templateUrl: "./role-users.component.html",
  styleUrls: ["./role-users.component.scss"],
})
export class RoleUsersComponent implements OnInit, OnChanges {
  // tslint:disable: prefer-for-of
  // tslint:disable: one-line

  @Input() role: RoleModel;
  @Input() usersArr: UserModel[];

  currentRoleUsers: { user: UserModel; companyCodeObj: CompanyCodeObj }[];

  selectedUsersFlags: boolean[];

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.usersArr) this.resetFlags();
  }

  private resetFlags(isInit?: boolean) {
    this.currentRoleUsers = [];
    this.usersArr.forEach((user) => {
      const userMatchedRoles = user.roles.filter((role) => role.role._id === this.role._id);
      if (userMatchedRoles && userMatchedRoles.length)
        for (const role of userMatchedRoles)
          this.currentRoleUsers.push({ user, companyCodeObj: new CompanyCodeObj(role.compCode, role.compCodeText) });
    });

    this.selectedUsersFlags = new Array(this.currentRoleUsers.length);
    let flagsArrLength = this.currentRoleUsers.length;
    while (flagsArrLength--) this.selectedUsersFlags[flagsArrLength] = false;

    if (!isInit) {
      const selectAllCheckbox = document.getElementById("select-all-users-checkbox") as HTMLInputElement;
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = false;
    }
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("select-all-users-checkbox") as HTMLInputElement;

    if (this.selectedUsersFlags.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    const numOfChecked = this.selectedUsersFlags.filter((flag) => {
      return flag === true;
    }).length;

    // All checked
    if (numOfChecked === this.role.permissions.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    }
    // None is checked
    else if (numOfChecked === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
    // Atleast one is checked
    else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  onUserClicked(index: number) {
    this.selectedUsersFlags[index] = !this.selectedUsersFlags[index];
    this.updateSelectAllCheckbox();
  }

  onAllUsersCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("select-all-users-checkbox") as HTMLInputElement;

    if (this.selectedUsersFlags.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.selectedUsersFlags.length; i++) this.selectedUsersFlags[i] = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.selectedUsersFlags.length; i++) this.selectedUsersFlags[i] = true;
      selectAllCheckbox.checked = true;
    }
  }

  onEditClicked() {
    this.matDialog
      .open(AssignRoleUsersComponent, {
        id: "assign-user-roles-dialog",
        panelClass: "md-dialog-container",
        disableClose: true,
        data: { role: this.role, users: this.usersArr, currentRoleUsers: this.currentRoleUsers },
      })
      .afterClosed()
      .subscribe((res: { user: UserModel; companyCodeObj: CompanyCodeObj }[]) => {
        if (res) {
          for (const user of this.usersArr) {
            const userMentioned = res.filter((roleUser) => {
              return user._id === roleUser.user._id;
            });

            user.roles = user.roles.filter((role) => role.role._id !== this.role._id);
            // if user has this role
            if (userMentioned && userMentioned.length)
              for (let i = 0; i < userMentioned.length; i++)
                if (
                  !user.roles.find((role) => role.role._id === this.role._id && role.compCode === userMentioned[i].companyCodeObj.compCode)
                )
                  user.roles.push({
                    role: this.role,
                    compCode: userMentioned[i].companyCodeObj.compCode,
                    compCodeText: userMentioned[i].companyCodeObj.compCodeText,
                  });
          }

          this.currentRoleUsers = [];
          res.forEach((obj) => {
            if (
              !this.currentRoleUsers.find(
                // (roleUser) => roleUser.user._id === obj.user._id && roleUser.companyCodeObj.compCode === obj.companyCodeObj.compCode
                (roleUser) => roleUser.user._id === obj.user._id
              )
            )
              this.currentRoleUsers.push(obj);
          });

          // If by any chance the users aren't sorted
          this.currentRoleUsers.sort((a, b) => {
            if ((a.user.firstName + " " + a.user.lastName).toLowerCase() > (b.user.firstName + " " + b.user.lastName).toLowerCase())
              return 1;
            else if ((a.user.firstName + " " + a.user.lastName).toLowerCase() < (b.user.firstName + " " + b.user.lastName).toLowerCase())
              return -1;
            else return 0;
          });

          // Setting selectedUsersFlags to false
          this.selectedUsersFlags = new Array(this.currentRoleUsers.length);
          for (let i = 0; i < this.selectedUsersFlags.length; i++) this.selectedUsersFlags[i] = false;

          this.updateSelectAllCheckbox();
        }
      });
  }

  onDeleteClicked() {
    for (let i = 0; i < this.selectedUsersFlags.length; i++) {
      if (this.selectedUsersFlags[i]) {
        this.currentRoleUsers[i].user.roles = this.currentRoleUsers[i].user.roles.filter(
          // (userRole) => !(userRole.role._id === this.role._id && userRole.compCode === this.currentRoleUsers[i].companyCodeObj.compCode)
          (userRole) => !(userRole.role._id === this.role._id)
        );
        this.currentRoleUsers.splice(i, 1);
        this.selectedUsersFlags.splice(i, 1);
        i--;
      }
    }

    this.updateSelectAllCheckbox();
  }
}
