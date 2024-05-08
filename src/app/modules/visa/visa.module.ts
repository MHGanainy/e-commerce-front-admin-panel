import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PDFViewerModule } from "src/app/shared/components/pdf-viewer/pdf-viewer.module";
import { SharedModule } from "src/app/shared/shared.module";

import { VisaRoutingModule } from "./visa-routing.module";
import { VisaComponent } from "./visa.component";

@NgModule({
  declarations: [VisaComponent],
  imports: [
    VisaRoutingModule,
    MatSortModule,
    NgxDatatableModule,
    CommonModule,
    SharedModule,
    PDFViewerModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class VisaModule {}
