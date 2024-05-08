import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalesmanInfoComponent } from "./views/salesman-info/salesman-info.component";
import { SalesmenComponent } from "./views/salesmen/salesmen.component";

const routes: Routes = [
  { path: "", component: SalesmenComponent },
  { path: "salesman-info", component: SalesmanInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesmenRoutingModule {}
