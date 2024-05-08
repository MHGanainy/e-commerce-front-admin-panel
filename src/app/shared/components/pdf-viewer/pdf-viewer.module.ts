import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";

import { SharedModule } from "../../shared.module";
import { PDFViewerComponent } from "./pdf-viewer.component";

@NgModule({
  declarations: [PDFViewerComponent],
  imports: [CommonModule, NgxExtendedPdfViewerModule, SharedModule],
  exports: [PDFViewerComponent],
})
export class PDFViewerModule {}
