import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { AssignRolePermissionsComponent } from "../assign-role-permissions/assign-role-permissions.component";
import { MatDialog } from "@angular/material/dialog";
import { PermissionModel } from "src/app/shared/models/Permission.model";
import { RoleModel } from "src/app/shared/models/Role.model";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-role-permissions",
  templateUrl: "./role-permissions.component.html",
  styleUrls: ["./role-permissions.component.scss"],
})
export class RolePermissionsComponent implements OnInit, OnChanges {
  // tslint:disable: prefer-for-of
  // tslint:disable: one-line

  @Input() role: RoleModel;

  selectedPermsFlags: boolean[] = [];

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.resetFlags(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resetFlags();
  }

  private resetFlags(isInit?: boolean) {
    this.selectedPermsFlags = new Array(this.role.permissions.length);
    let flagsArrLength = this.role.permissions.length;
    while (flagsArrLength--) this.selectedPermsFlags[flagsArrLength] = false;

    if (!isInit) {
      const selectAllCheckbox = document.getElementById("select-all-perms-checkbox") as HTMLInputElement;
      selectAllCheckbox.indeterminate = false;
      selectAllCheckbox.checked = false;
    }
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("select-all-perms-checkbox") as HTMLInputElement;

    if (this.selectedPermsFlags.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    const numOfChecked = this.selectedPermsFlags.filter((flag) => {
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

  onPermClicked(index: number) {
    this.selectedPermsFlags[index] = !this.selectedPermsFlags[index];
    this.updateSelectAllCheckbox();
  }

  onAllPermsCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("select-all-perms-checkbox") as HTMLInputElement;

    if (this.selectedPermsFlags.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.selectedPermsFlags.length; i++) this.selectedPermsFlags[i] = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.selectedPermsFlags.length; i++) this.selectedPermsFlags[i] = true;
      selectAllCheckbox.checked = true;
    }
  }

  onEditClicked() {
    this.matDialog
      .open(AssignRolePermissionsComponent, {
        id: "assign-user-roles-dialog",
        panelClass: "md-dialog-container",
        disableClose: true,
        data: { currentRolePermissions: this.role.permissions },
      })
      .afterClosed()
      .subscribe((res: PermissionModel[]) => {
        if (res) {
          // Setting user's roles
          this.role.permissions = [];
          for (const resPerm of res)
            if (!this.role.permissions.find((perm) => perm.permission === resPerm.permission)) this.role.permissions.push(resPerm);

          // If by any chance the roles aren't sorted
          this.role.permissions.sort((a, b) => {
            if (a.permission.toLowerCase() > b.permission.toLowerCase()) return 1;
            else if (a.permission.toLowerCase() < b.permission.toLowerCase()) return -1;
            else return 0;
          });

          // Setting selectedRolesFlags to false
          this.selectedPermsFlags = new Array(this.role.permissions.length);
          for (let i = 0; i < this.selectedPermsFlags.length; i++) this.selectedPermsFlags[i] = false;

          this.updateSelectAllCheckbox();
        }
      });
  }

  onDeleteClicked() {
    for (let i = 0; i < this.selectedPermsFlags.length; i++) {
      if (this.selectedPermsFlags[i]) {
        this.role.permissions.splice(i, 1);
        this.selectedPermsFlags.splice(i, 1);
        i--;
      }
    }

    this.updateSelectAllCheckbox();
  }
}
