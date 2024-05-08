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

import { AppointmentHistoryRoutingModule } from "./appointment-history-routing.module";
import { AppointmentHistoryComponent } from "./appointment-history.component";

@NgModule({
  declarations: [AppointmentHistoryComponent],
  imports: [
    CommonModule,
    AppointmentHistoryRoutingModule,
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
export class AppointmentHistoryModule {}
