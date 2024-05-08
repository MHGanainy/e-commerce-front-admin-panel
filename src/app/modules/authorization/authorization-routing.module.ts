import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthorizationHomeComponent } from "./views/authorization-home/authorization-home.component";

const routes: Routes = [
  { path: "", component: AuthorizationHomeComponent },
  { path: "admin-users", loadChildren: () => import("./modules/admin-users/admin-users.module").then((m) => m.AdminUsersModule) },
  { path: "salesmen", loadChildren: () => import("./modules/salesmen/salesmen.module").then((m) => m.SalesmenModule) },
  { path: "roles", loadChildren: () => import("./modules/roles/roles.module").then((m) => m.RolesModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
