import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

import { SharedModule } from "src/app/shared/shared.module";

import { SalesDetailsComponent } from "./components/sales-details/sales-details.component";
import { SalesReportRoutingModule } from "./sales-report-routing.module";
import { SalesReportComponent } from "./sales-report.component";

@NgModule({
  declarations: [SalesReportComponent, SalesDetailsComponent],
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule,
  ],
  providers: [MatDatepickerModule, MatTableModule, MatPaginatorModule],
})
export class SalesReportModule {}
