import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { SharedModule } from "src/app/shared/shared.module";

import { SalesmenRoutingModule } from "./salesmen-routing.module";
import { SalesmanInfoComponent } from "./views/salesman-info/salesman-info.component";
import { SalesmenComponent } from "./views/salesmen/salesmen.component";

@NgModule({
  declarations: [SalesmenComponent, SalesmanInfoComponent],
  imports: [CommonModule, SharedModule, SalesmenRoutingModule, AngularMultiSelectModule, MatCheckboxModule],
})
export class SalesmenModule {}
