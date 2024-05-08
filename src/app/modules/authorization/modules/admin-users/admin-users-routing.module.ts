import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminUserInfoComponent } from "./views/admin-user-info/admin-user-info.component";
import { AdminUsersComponent } from "./views/admin-users/admin-users.component";

const routes: Routes = [
  { path: "", component: AdminUsersComponent },
  { path: "admin-user-info", component: AdminUserInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminUsersRoutingModule {}
