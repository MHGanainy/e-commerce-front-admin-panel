import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";

import { SharedModule } from "src/app/shared/shared.module";

import { FindUtmRoutingModule } from "./find-utm-routing.module";
import { FindUtmComponent } from "./find-utm.component";

@NgModule({
  declarations: [FindUtmComponent],
  imports: [
    CommonModule,
    FindUtmRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    MatNativeDateModule,
    MatCardModule,
  ],
  providers: [MatDatepickerModule, MatTableModule],
})
export class FindUtmModule {}
