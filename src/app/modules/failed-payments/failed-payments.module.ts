import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

import { SharedModule } from "src/app/shared/shared.module";

import { FailedPaymentsRoutingModule } from "./failed-payments-routing.module";
import { FailedPaymentsComponent } from "./failed-payments.component";

@NgModule({
  declarations: [FailedPaymentsComponent],
  imports: [CommonModule, FailedPaymentsRoutingModule, MatPaginatorModule, MatTableModule, SharedModule],
})
export class FailedPaymentsModule {}
