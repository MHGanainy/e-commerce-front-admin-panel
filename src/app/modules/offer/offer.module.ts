import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";

import { OfferRoutingModule } from "./offer-routing.module";
import { OfferComponent } from "./offer.component";

@NgModule({
  declarations: [OfferComponent],
  imports: [CommonModule, OfferRoutingModule, SharedModule],
})
export class OfferModule {}
