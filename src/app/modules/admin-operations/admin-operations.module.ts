import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

import { SharedModule } from "src/app/shared/shared.module";

import { AdminOperationsRoutingModule } from "./admin-operations-routing.module";
import { AdminOperationsComponent } from "./admin-operations.component";

@NgModule({
  declarations: [AdminOperationsComponent],
  imports: [CommonModule, AdminOperationsRoutingModule, MatPaginatorModule, MatTableModule, SharedModule],
})
export class AdminOperationsModule {}
