import { CommonModule, DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MDBBootstrapModule } from "angular-bootstrap-md";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CookieService } from "ngx-cookie-service";

import { AccessDeniedComponent } from "./components/access-denied/access-denied.component";
import { CustomTooltipComponent } from "./components/custom-tooltip/custom-tooltip.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { SuccessDialogComponent } from "./components/success-dialog/success-dialog.component";
import { TimeFunctions } from "./functions/time.functions";
import { ValidationFunctions } from "./functions/validation.functions";
import { AlertPopupComponent } from "./popup-components/alert-popup/alert-popup.component";
import { ErrorDialogComponent } from "./popup-components/error-dialog/error-dialog.component";
import { UnitDetailsPopupComponent } from "./popup-components/unit-details-popup/unit-details-popup.component";
import { UserDetailsPopupComponent } from "./popup-components/user-details-popup/user-details-popup.component";

@NgModule({
  declarations: [
    ErrorDialogComponent,
    AlertPopupComponent,
    UserDetailsPopupComponent,
    UnitDetailsPopupComponent,
    LoadingSpinnerComponent,
    CustomTooltipComponent,
    AccessDeniedComponent,
    PaginationComponent,
    SuccessDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    MatSnackBarModule,
    BsDropdownModule.forRoot(),
    MDBBootstrapModule.forRoot(),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    CookieService,
    ValidationFunctions,
    TimeFunctions,
    DecimalPipe,
  ],
  exports: [
    LazyLoadImageModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    AlertPopupComponent,
    UserDetailsPopupComponent,
    UnitDetailsPopupComponent,
    LoadingSpinnerComponent,
    CustomTooltipComponent,
    AccessDeniedComponent,
    PaginationComponent,
  ],
})
export class SharedModule {}
