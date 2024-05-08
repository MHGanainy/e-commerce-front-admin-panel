import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PDFViewerModule } from "src/app/shared/components/pdf-viewer/pdf-viewer.module";
import { SharedModule } from "src/app/shared/shared.module";

import { BankApprovalRoutingModule } from "./bank-approval-routing.module";
import { BankApprovalComponent } from "./bank-approval.component";
import { ImageViewerPopupComponent } from "./image-viewer-popup/image-viewer-popup.component";
import { TransactionRejectionPopupComponent } from "./transaction-rejection-popup/transaction-rejection-popup.component";

@NgModule({
  declarations: [BankApprovalComponent, ImageViewerPopupComponent, TransactionRejectionPopupComponent],
  imports: [
    BankApprovalRoutingModule,
    NgxDatatableModule,
    CommonModule,
    SharedModule,
    PDFViewerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
})
export class BankApprovalModule {}
