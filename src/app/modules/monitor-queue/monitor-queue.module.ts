import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { SharedModule } from "src/app/shared/shared.module";

import { ChosenFilterComponent } from "./components/chosen-filter/chosen-filter.component";
import { FilterPopupComponent } from "./components/filter-popup/filter-popup.component";
import { FilterTableBaseComponent } from "./components/filter-table-base/filter-table-base.component";
import { MonitorCardsComponent } from "./components/monitor-cards/monitor-cards.component";
import { MonitorQueueRoutingModule } from "./monitor-queue-routing.module";
import { MonitorQueueComponent } from "./monitor-queue.component";

@NgModule({
  declarations: [MonitorQueueComponent, FilterPopupComponent, ChosenFilterComponent, FilterTableBaseComponent, MonitorCardsComponent],
  imports: [
    CommonModule,
    MonitorQueueRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    SharedModule,
  ],
})
export class MonitorQueueModule {}
