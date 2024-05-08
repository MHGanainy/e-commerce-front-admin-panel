import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { UserDAOService } from "src/app/core/http/user-dao.service";
import { UserModel } from "src/app/shared/models/User.model";
import { UserRoleModel } from "src/app/shared/models/UserRole.model";
import { AlertPopupComponent } from "src/app/shared/popup-components/alert-popup/alert-popup.component";

import { AssignUserRolesComponent } from "../../components/assign-user-roles/assign-user-roles.component";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "authorization-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.scss"],
})
export class AdminUsersComponent implements OnInit {
  // tslint:disable: one-line
  isLoading = true;

  users: UserModel[];
  selectedUser: UserModel;

  selectedRolesFlags: boolean[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDAOService: UserDAOService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.userDAOService.getAllUsers().subscribe((res) => {
      this.users = res;
      // // Testing if roles table overflows
      // for (let i = 0; i < 50; i++) this.users[0].roles.push(this.users[0].roles[0]);

      this.activatedRoute.queryParams.subscribe(
        (params) => {
          if (params && params._id) this.selectedUser = this.users.find((user) => user._id === params._id);

          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    });
  }

  private updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById("select-all-user-roles-checkbox") as HTMLInputElement;

    if (this.selectedRolesFlags.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      return;
    }

    // Checking if all checked
    let allChecked = true,
      atleastOneChecked = false;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.selectedRolesFlags.length; i++) {
      if (!this.selectedRolesFlags[i]) allChecked = false;
      else atleastOneChecked = true;
    }

    // All checked
    if (allChecked) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    }
    // Atleast one is checked
    else if (atleastOneChecked) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
    // None is checked
    else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
  }

  onUserClicked(index: number) {
    if (this.users[index] === this.selectedUser) return;

    this.selectedUser = this.users[index];
    this.selectedRolesFlags = this.selectedUser.roles.map(() => {
      return false;
    });

    try {
      // The followinn line will create a "cannot set value of null" error on first time selecting user.
      // Just ignore it and the code will work just fine
      this.updateSelectAllCheckbox();
    } catch (error) {}
  }

  onRoleClicked(index: number) {
    this.selectedRolesFlags[index] = !this.selectedRolesFlags[index];
    this.updateSelectAllCheckbox();
  }

  onAllRolesCheckClicked(event: MouseEvent) {
    const selectAllCheckbox = document.getElementById("select-all-user-roles-checkbox") as HTMLInputElement;

    if (this.selectedRolesFlags.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }

    // Inverting checkbox checked value as the event is executed after the new value is set
    const isChecked = !selectAllCheckbox.checked;
    if (isChecked) {
      for (let i = 0; i < this.selectedRolesFlags.length; i++) this.selectedRolesFlags[i] = false;
      selectAllCheckbox.checked = false;
    } else {
      for (let i = 0; i < this.selectedRolesFlags.length; i++) this.selectedRolesFlags[i] = true;
      selectAllCheckbox.checked = true;
    }
  }

  openEditRoles() {
    this.matDialog
      .open(AssignUserRolesComponent, {
        id: "assign-user-roles-dialog",
        panelClass: "md-dialog-container",
        disableClose: true,
        data: { currentUserRoles: this.selectedUser.roles },
      })
      .afterClosed()
      .subscribe((res: { roles: UserRoleModel[] }) => {
        if (res) {
          // Setting user's roles
          this.selectedUser.roles = [];
          for (const role of res.roles)
            if (!this.selectedUser.roles.find((userRole) => role.role._id === userRole.role._id && role.compCode === userRole.compCode))
              this.selectedUser.roles.push({
                role: role.role,
                compCode: role.compCode,
                compCodeText: role.compCodeText,
              });

          // If by any chance the roles aren't sorted
          this.selectedUser.roles.sort((a, b) => {
            if (a.role._id.toLowerCase() > b.role._id.toLowerCase()) return 1;
            else if (a.role._id.toLowerCase() < b.role._id.toLowerCase()) return -1;
            else return 0;
          });

          // Setting selectedRolesFlags to false
          this.selectedRolesFlags = new Array(this.selectedUser.roles.length);
          for (let i = 0; i < this.selectedRolesFlags.length; i++) this.selectedRolesFlags[i] = false;

          this.updateSelectAllCheckbox();
        }
      });
  }

  deleteRoles() {
    for (let i = 0; i < this.selectedRolesFlags.length; i++) {
      if (this.selectedRolesFlags[i]) {
        this.selectedUser.roles.splice(i, 1);
        this.selectedRolesFlags.splice(i, 1);
        i--;
      }
    }

    this.updateSelectAllCheckbox();
  }

  onEditClicked(index: number) {
    this.router.navigate(["admin-user-info"], {
      relativeTo: this.activatedRoute,
      state: this.users[index],
      queryParams: { _id: this.users[index]._id },
    });
  }

  onCreateClicked() {
    // this.matDialog
    //   .open(ChooseUserTypeComponent, { panelClass: "md-dialog-container", hasBackdrop: true, disableClose: true })
    //   .afterClosed()
    //   .subscribe((res: "admin-user" | "salesman") => {
    //     if (res === "admin-user") this.router.navigate(["admin-user-info"], { relativeTo: this.activatedRoute });
    //     else if (res === "salesman") this.router.navigate(["salesman-info"], { relativeTo: this.activatedRoute });
    //   });

    this.router.navigate(["admin-user-info"], { relativeTo: this.activatedRoute });
  }

  saveAll() {
    this.isLoading = true;
    // Sending updated data to backend
    this.userDAOService.updateUsers(this.users).subscribe((res) => {
      this.users = res;

      // Setting new selectedUser object, as old value reference is still in memeory, but is no longer in the array
      if (this.selectedUser) this.selectedUser = this.users.find((user) => this.selectedUser._id === user._id);

      this.isLoading = false;

      this.matDialog.open(AlertPopupComponent, {
        panelClass: "md-dialog-container",
        id: "users-updated-success-dialog",
        data: { type: "success", message: "Admin Users data updated successfully." },
      });
    });
  }
}
