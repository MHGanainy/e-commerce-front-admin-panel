import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { UtilitiesDAOService } from "src/app/core/http/utilities-dao.service";
import { CompanyCodeObj } from "src/app/shared/models/CompanyCode.model";
import { RoleModel } from "src/app/shared/models/Role.model";
import { UserModel } from "src/app/shared/models/User.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

class TempUserModel extends UserModel {
  isSelected?: boolean;

  constructor() {
    super();
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-assign-role-users",
  templateUrl: "./assign-role-users.component.html",
  styleUrls: ["./assign-role-users.component.scss"],
})
export class AssignRoleUsersComponent implements OnInit, AfterViewInit {
  // tslint:disable: prefer-for-of
  // tslint:disable: one-line

  loadingFlag = true;

  role: RoleModel;

  userSearchValue = "";
  tempUsersArr: { user: UserModel; companyCodeObj: CompanyCodeObj; isSelected?: boolean }[] = [];
  allUsersArr: UserModel[] = [];

  companyCodes: CompanyCodeObj[];

  companyCodesControls: FormControl[] = [];
  filteredCompanyCodes: Observable<CompanyCodeObj[]>[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { role: RoleModel; users: UserModel[]; currentRoleUsers: { user: UserModel; companyCodeObj: CompanyCodeObj }[] },
    private utilitiesDAOService: UtilitiesDAOService,
    private dialogRef: MatDialogRef<AssignRoleUsersComponent>,
    private matDialog: MatDialog
  ) {
    this.role = data.role;
    this.allUsersArr = data.users;

    // Setting Which users are selected
    // this.tempUsersArr.forEach((user) => {
    //   user.isSelected = Boolean(
    //     data.currentRoleUsers.find((roleUser) => {
    //       return roleUser.user._id === user._id;
    //     })
    //   );
    // });

    this.allUsersArr.forEach((user) => {
      const userRoleCount = data.currentRoleUsers.filter((roleUser) => {
        return roleUser.user._id === user._id;
      });

      if (userRoleCount && userRoleCount.length)
        for (let i = 0; i < userRoleCount.length; i++)
          this.tempUsersArr.push({ user, companyCodeObj: userRoleCount[i].companyCodeObj, isSelected: true });
      else this.tempUsersArr.push({ user, companyCodeObj: new CompanyCodeObj() });
    });

    for (let i = 0; i < this.tempUsersArr.length; i++) {
      // Init company codes autocomplete
      const companyCodeControl = new FormControl();
      const companyCodeControlObservable = companyCodeControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          if (typeof value === "object") {
            const companyCodeObj = value as CompanyCodeObj;
            if (companyCodeObj) {
              this.tempUsersArr[i].companyCodeObj.compCode = companyCodeObj.compCode;
              this.tempUsersArr[i].companyCodeObj.compCodeText = companyCodeObj.compCodeText;

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
              this.tempUsersArr[i].companyCodeObj.compCode = companyCodeObj.compCode;
              this.tempUsersArr[i].companyCodeObj.compCodeText = companyCodeObj.compCodeText;
            } else this.tempUsersArr[i].companyCodeObj = new CompanyCodeObj();
          }
          return this._filterCompanyCodes(value);
        })
      );
      this.companyCodesControls.push(companyCodeControl);
      this.filteredCompanyCodes.push(companyCodeControlObservable);
      if (this.tempUsersArr[i].companyCodeObj.compCode)
        companyCodeControl.setValue(
          this.tempUsersArr[i].companyCodeObj.compCodeText + " (" + this.tempUsersArr[i].companyCodeObj.compCode + ")"
        );
    }

    // this.updateSelectAllCheckbox();
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
  ngOnInit() {
    this.utilitiesDAOService.getAllCompanyCode().subscribe((res) => {
      this.companyCodes = res;

      this.loadingFlag = false;
    });
  }

  ngAfterViewInit() {
    this.updateSelectAllCheckbox();
  }

  matchUserName(user: UserModel) {
    return (user.firstName + " " + user.lastName).toLowerCase().match(this.userSearchValue.toLowerCase());
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("assign-all-users-checkbox") as HTMLInputElement;

    if (this.tempUsersArr.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    const numOfChecked = this.tempUsersArr.filter((user) => {
      return user.isSelected;
    }).length;

    // All checked
    if (numOfChecked === this.tempUsersArr.length) {
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

  onAllUsersCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("assign-all-users-checkbox") as HTMLInputElement;

    if (this.tempUsersArr == null || this.tempUsersArr.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.tempUsersArr.length; i++) this.tempUsersArr[i].isSelected = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.tempUsersArr.length; i++) this.tempUsersArr[i].isSelected = true;
      selectAllCheckbox.checked = true;
    }
  }

  onUserClicked(index: number) {
    this.tempUsersArr[index].isSelected = !this.tempUsersArr[index].isSelected;
    this.updateSelectAllCheckbox();
  }

  // addUser(user: UserModel, index: number) {
  //   user.roles.push({ role: this.role, compCode: null, compCodeText: null });

  //   this.tempUsersArr.push({ user, companyCodeObj: new CompanyCodeObj(), isSelected: true });

  //   const newIndex = this.tempUsersArr.length - 1;
  //   const companyCodeControl = new FormControl();
  //   const companyCodeControlObservable = companyCodeControl.valueChanges.pipe(
  //     startWith(""),
  //     map((value) => {
  //       if (typeof value === "object") {
  //         const companyCodeObj = value as CompanyCodeObj;
  //         if (companyCodeObj) {
  //           this.tempUsersArr[newIndex].companyCodeObj.compCode = companyCodeObj.compCode;
  //           this.tempUsersArr[newIndex].companyCodeObj.compCodeText = companyCodeObj.compCodeText;

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
  //           this.tempUsersArr[newIndex].companyCodeObj.compCode = companyCodeObj.compCode;
  //           this.tempUsersArr[newIndex].companyCodeObj.compCodeText = companyCodeObj.compCodeText;
  //         }
  //       }
  //       return this._filterCompanyCodes(value);
  //     })
  //   );
  //   this.companyCodesControls.push(companyCodeControl);
  //   this.filteredCompanyCodes.push(companyCodeControlObservable);
  // }

  onSaveClicked() {
    const selectedUsersArr: { user: UserModel; companyCodeObj: CompanyCodeObj; isSelected?: boolean }[] = [];
    for (let i = 0; i < this.tempUsersArr.length; i++) {
      const user = this.tempUsersArr[i];
      if (user.isSelected) selectedUsersArr.push(user);
    }

    if (selectedUsersArr.length === 0)
      this.matDialog
        .open(AlertPopupComponent, {
          panelClass: "md-dialog-container",
          id: "no-users-selected-warning-dialog",
          disableClose: true,
          data: {
            type: "warning",
            message: "You haven't selected any users. Do you still want to proceed?",
            showYesButton: true,
            showCancelButton: true,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res === "yes")
            this.dialogRef.close(
              selectedUsersArr.map((obj) => {
                delete obj.isSelected;
                return obj;
              })
            );
        });
    else {
      let errorsFound = 0;
      // for (const obj of selectedUsersArr) if (!obj.companyCodeObj || !obj.companyCodeObj.compCode) errorsFound++;
      if (errorsFound)
        this.matDialog.open(AlertPopupComponent, {
          id: "no-company-code-selected-error-dialog",
          panelClass: "md-dialog-container",
          data: {
            type: "danger",
            message: `${errorsFound > 1 ? errorsFound : "a"} user${errorsFound > 1 ? "s" : ""} you have selected ${
              errorsFound > 1 ? "don't" : "doesn't"
            } have a company code. Please check your inputs.`,
          },
        });
      else
        this.dialogRef.close(
          selectedUsersArr.map((obj) => {
            delete obj.isSelected;
            return obj;
          })
        );
    }
  }

  onCancelClicked() {
    this.dialogRef.close();
  }
}
