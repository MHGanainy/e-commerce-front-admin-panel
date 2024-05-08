import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { SharedModule } from "src/app/shared/shared.module";

import { AssignRolePermissionsComponent } from "./components/assign-role-permissions/assign-role-permissions.component";
import { AssignRoleUsersComponent } from "./components/assign-role-users/assign-role-users.component";
import { CreateRoleComponent } from "./components/create-role/create-role.component";
import { RolePermissionsComponent } from "./components/role-permissions/role-permissions.component";
import { RoleUsersComponent } from "./components/role-users/role-users.component";
import { RolesRoutingModule } from "./roles-routing.module";
import { RolesComponent } from "./views/roles/roles.component";

@NgModule({
  declarations: [
    RolesComponent,
    RolePermissionsComponent,
    RoleUsersComponent,
    CreateRoleComponent,
    AssignRolePermissionsComponent,
    AssignRoleUsersComponent,
  ],
  imports: [CommonModule, SharedModule, RolesRoutingModule, MatAutocompleteModule],
})
export class RolesModule {}
