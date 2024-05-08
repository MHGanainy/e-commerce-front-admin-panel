import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";

import { OtpFinderRoutingModule } from "./otp-finder-routing.module";
import { OtpFinderComponent } from "./otp-finder.component";

@NgModule({
  declarations: [OtpFinderComponent],
  imports: [CommonModule, OtpFinderRoutingModule, SharedModule],
})
export class OtpFinderModule {}
