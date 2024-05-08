import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { SharedModule } from "src/app/shared/shared.module";

import { AdminUsersRoutingModule } from "./admin-users-routing.module";
import { AssignUserRolesComponent } from "./components/assign-user-roles/assign-user-roles.component";
import { AdminUserInfoComponent } from "./views/admin-user-info/admin-user-info.component";
import { AdminUsersComponent } from "./views/admin-users/admin-users.component";

@NgModule({
  declarations: [AdminUsersComponent, AssignUserRolesComponent, AdminUserInfoComponent],
  imports: [CommonModule, SharedModule, AdminUsersRoutingModule, MatAutocompleteModule],
})
export class AdminUsersModule {}
