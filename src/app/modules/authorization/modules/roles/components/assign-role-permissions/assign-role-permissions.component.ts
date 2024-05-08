import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";
import { PermissionModel } from "src/app/shared/models/Permission.model";
import { UtilitiesDAOService } from "src/app/core/http/utilities-dao.service";

class TempPermissionModel extends PermissionModel {
  isSelected?: boolean;

  constructor() {
    super();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-assign-role-permissions",
  templateUrl: "./assign-role-permissions.component.html",
  styleUrls: ["./assign-role-permissions.component.scss"],
})
export class AssignRolePermissionsComponent implements OnInit {
  // tslint:disable: prefer-for-of
  // tslint:disable: one-line

  loadingFlag = true;

  searchValue = "";

  permsArr: TempPermissionModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { currentRolePermissions: PermissionModel[] },
    private dialogRef: MatDialogRef<AssignRolePermissionsComponent>,
    private utilitiesDAOService: UtilitiesDAOService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.utilitiesDAOService.getAllPermissions().subscribe((res) => {
      this.permsArr = res;
      // // Filtering existing user roles
      // this.permsArr = this.permsArr.filter((role) => {
      //   // If a role already exist in the currently assigned user roles, the find function will return that role
      //   // Else, it will return undefined
      //   // So we Invert the boolean as we only want the roles that don't exist
      //   return !Boolean(
      //     this.data.currentUserRoles.find((userRole) => {
      //       return userRole.role._id === role._id;
      //     })
      //   );
      // });

      // Checking already existing user roles
      this.permsArr.forEach((perm) => {
        // If a role already exist in the currently assigned user roles, the find function will return that role
        // Else, it will return undefined
        perm.isSelected = Boolean(
          this.data.currentRolePermissions.find((rolePerm) => {
            return rolePerm.permission === perm.permission;
          })
        );
      });

      this.updateSelectAllCheckbox();
      this.loadingFlag = false;
    });
  }

  matchPerm(perm: PermissionModel) {
    return (
      perm.permission.toLowerCase().match(this.searchValue.toLowerCase()) ||
      perm.permissionText.toLowerCase().match(this.searchValue.toLowerCase())
    );
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("assign-all-perms-checkbox") as HTMLInputElement;

    if (this.permsArr.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    const numOfChecked = this.permsArr.filter((perm) => {
      return perm.isSelected;
    }).length;

    // All checked
    if (numOfChecked === this.permsArr.length) {
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

  onAllPermsCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("assign-all-perms-checkbox") as HTMLInputElement;

    if (this.permsArr == null || this.permsArr.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.permsArr.length; i++) this.permsArr[i].isSelected = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.permsArr.length; i++) this.permsArr[i].isSelected = true;
      selectAllCheckbox.checked = true;
    }
  }

  onPermClicked(index: number) {
    this.permsArr[index].isSelected = !this.permsArr[index].isSelected;
    this.updateSelectAllCheckbox();
  }

  onSaveClicked() {
    const selectedPermsArr = this.permsArr
      .filter((perm) => {
        return perm.isSelected;
      })
      .map((perm) => {
        delete perm.isSelected;
        return perm;
      });

    if (selectedPermsArr.length === 0)
      this.matDialog
        .open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          id: "no-perms-selected-warning-dialog",
          disableClose: true,
          data: {
            type: "warning",
            message: "You haven't selected any permissions. Do you still want to proceed?",
            showYesButton: true,
            showCancelButton: true,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res === "yes") this.dialogRef.close(selectedPermsArr);
        });
    else this.dialogRef.close(selectedPermsArr);
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
