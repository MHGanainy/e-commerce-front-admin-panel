import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { RoleDAOService } from "src/app/core/http/role-dao.service";
import { UtilitiesDAOService } from "src/app/core/http/utilities-dao.service";
import { CompanyCodeObj } from "src/app/shared/models/CompanyCode.model";
import { RoleModel } from "src/app/shared/models/Role.model";
import { UserRoleModel } from "src/app/shared/models/UserRole.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

class TempUserRoleModel extends UserRoleModel {
  isSelected?: boolean;

  constructor() {
    super();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-assign-user-roles",
  templateUrl: "./assign-user-roles.component.html",
  styleUrls: ["./assign-user-roles.component.scss"],
})
export class AssignUserRolesComponent implements OnInit {
  // tslint:disable: prefer-for-of
  // tslint:disable: one-line

  loadingFlags: boolean[] = [true];

  roleSearchValue = "";
  rolesArr: TempUserRoleModel[];

  companyCodes: CompanyCodeObj[];

  companyCodesControls: FormControl[] = [];
  filteredCompanyCodes: Observable<CompanyCodeObj[]>[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { currentUserRoles: UserRoleModel[] },
    private dialogRef: MatDialogRef<AssignUserRolesComponent>,
    private roleDAOService: RoleDAOService,
    private utilitiesDAOService: UtilitiesDAOService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.roleDAOService.getAllRoles().subscribe((res) => {
      this.rolesArr = [];

      // Checking already existing user roles
      res.forEach((role) => {
        const selectedUserRoles = this.data.currentUserRoles.filter((userRole) => {
          return userRole.role._id === role._id;
        });

        if (selectedUserRoles && selectedUserRoles.length)
          for (let i = 0; i < selectedUserRoles.length; i++)
            this.rolesArr.push({
              role,
              // compCode: selectedUserRoles[i].compCode,
              // compCodeText: selectedUserRoles[i].compCodeText,
              compCode: null,
              compCodeText: null,
              isSelected: true,
            });
        else {
          this.rolesArr.push({ role, compCode: null, compCodeText: null });
        }
      });

      for (let i = 0; i < this.rolesArr.length; i++) {
        // Init company codes autocomplete
        const companyCodeControl = new FormControl();
        const companyCodeControlObservable = companyCodeControl.valueChanges.pipe(
          startWith(""),
          map((value) => {
            if (typeof value === "object") {
              const companyCodeObj = value as CompanyCodeObj;
              if (companyCodeObj) {
                this.rolesArr[i].compCode = companyCodeObj.compCode;
                this.rolesArr[i].compCodeText = companyCodeObj.compCodeText;

                value = companyCodeObj.compCodeText + " (" + companyCodeObj.compCode + ")";
                this.companyCodesControls[i].setValue(value);
              }
            } else if (this.companyCodes) {
              const companyCodeObj = this.companyCodes.find((code) => {
                try {
                  return code.compCode === (value as string).split("(")[1].replace(")", "");
                } catch (error) {
                  return false;
                }
              });
              if (companyCodeObj) {
                this.rolesArr[i].compCode = companyCodeObj.compCode;
                this.rolesArr[i].compCodeText = companyCodeObj.compCodeText;
              } else {
                this.rolesArr[i].compCode = "";
                this.rolesArr[i].compCodeText = "";
              }
            }
            return this._filterCompanyCodes(value);
          })
        );
        this.companyCodesControls.push(companyCodeControl);
        this.filteredCompanyCodes.push(companyCodeControlObservable);
        if (this.rolesArr[i].compCode) companyCodeControl.setValue(this.rolesArr[i].compCodeText + " (" + this.rolesArr[i].compCode + ")");
      }

      this.updateSelectAllCheckbox();
      this.loadingFlags.pop();
    });

    this.loadingFlags.push(true);
    this.utilitiesDAOService.getAllCompanyCode().subscribe((res) => {
      this.companyCodes = res;

      this.loadingFlags.pop();
    });
  }

  private _filterCompanyCodes(value: string): CompanyCodeObj[] {
    if (this.companyCodes) {
      const filterValue = value.toLowerCase();

      return this.companyCodes.filter(
        (option) =>
          (option.compCodeText + " " + option.compCode).toLowerCase().includes(filterValue) ||
          (option.compCodeText + "(" + option.compCode + ")").toLowerCase().includes(filterValue) ||
          (option.compCodeText + " (" + option.compCode + ")").toLowerCase().includes(filterValue)
      );
    }
  }

  matchRole(role: RoleModel) {
    return (role._id + " " + role.roleText).toLowerCase().match(this.roleSearchValue.toLowerCase());
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("assign-all-roles-checkbox") as HTMLInputElement;

    if (this.rolesArr.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    const numOfChecked = this.rolesArr.filter((role) => {
      return role.isSelected;
    }).length;

    // All checked
    if (numOfChecked === this.rolesArr.length) {
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

  onAllRolesCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("assign-all-roles-checkbox") as HTMLInputElement;

    if (this.rolesArr == null || this.rolesArr.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.rolesArr.length; i++) this.rolesArr[i].isSelected = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.rolesArr.length; i++) this.rolesArr[i].isSelected = true;
      selectAllCheckbox.checked = true;
    }
  }

  onRoleClicked(index: number) {
    this.rolesArr[index].isSelected = !this.rolesArr[index].isSelected;
    this.updateSelectAllCheckbox();
  }

  // addRole(role: TempUserRoleModel, index: number) {
  //   const newRole = new TempUserRoleModel();
  //   newRole.role = new RoleModel();
  //   newRole.role._id = role.role._id;
  //   newRole.role.roleText = role.role.roleText;
  //   newRole.isSelected = true;

  //   this.rolesArr.push(newRole);

  //   const newIndex = this.rolesArr.length - 1;
  //   const companyCodeControl = new FormControl();
  //   const companyCodeControlObservable = companyCodeControl.valueChanges.pipe(
  //     startWith(""),
  //     map((value) => {
  //       if (typeof value === "object") {
  //         const companyCodeObj = value as CompanyCodeObj;
  //         if (companyCodeObj) {
  //           this.rolesArr[newIndex].compCode = companyCodeObj.compCode;
  //           this.rolesArr[newIndex].compCodeText = companyCodeObj.compCodeText;

  //           value = companyCodeObj.compCodeText + " (" + companyCodeObj.compCode + ")";
  //           this.companyCodesControls[newIndex].setValue(value);
  //         }
  //       } else if (this.companyCodes) {
  //         const companyCodeObj = this.companyCodes.find((code) => {
  //           try {
  //             return code.compCode === (value as string).split("(")[1].replace(")", "");
  //           } catch (error) {
  //             return false;
  //           }
  //         });
  //         if (companyCodeObj) {
  //           this.rolesArr[newIndex].compCode = companyCodeObj.compCode;
  //           this.rolesArr[newIndex].compCodeText = companyCodeObj.compCodeText;
  //         }
  //       }
  //       return this._filterCompanyCodes(value);
  //     })
  //   );
  //   this.companyCodesControls.push(companyCodeControl);
  //   this.filteredCompanyCodes.push(companyCodeControlObservable);
  // }

  onSaveClicked() {
    const selectedRolesArr = this.rolesArr.filter((role) => {
      return role.isSelected;
    });

    if (selectedRolesArr.length === 0)
      this.matDialog
        .open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          id: "no-roles-selected-warning-dialog",
          disableClose: true,
          data: {
            type: "warning",
            message: "You haven't selected any roles. Do you still want to proceed?",
            showYesButton: true,
            showCancelButton: true,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res === "yes")
            this.dialogRef.close({
              roles: selectedRolesArr.map((role) => {
                delete role.isSelected;
                return role;
              }),
            });
        });
    else {
      let errorsFound = 0;
      // for (const role of selectedRolesArr) if (!role.compCode) errorsFound++;
      if (errorsFound)
        this.matDialog.open(AlertPopupComponent, {
          id: "no-company-code-selected-error-dialog",
          panelClass: "md-dialog-container",
          data: {
            type: "danger",
            message: `${errorsFound > 1 ? errorsFound : "a"} role${errorsFound > 1 ? "s" : ""} you have selected ${
              errorsFound > 1 ? "don't" : "doesn't"
            } have a company code. Please check your inputs.`,
          },
        });
      else
        this.dialogRef.close({
          roles: selectedRolesArr.map((role) => {
            delete role.isSelected;
            return role;
          }),
        });
    }
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}

/** To Do
 * company code selection (Done El7)
 * Add Role (Done El7)
 * Adjust Roles Sorting After Adding new Role
 *  */
