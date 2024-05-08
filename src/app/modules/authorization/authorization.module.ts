import { AuthorizationHomeComponent } from "./views/authorization-home/authorization-home.component";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "./../../shared/shared.module";

@NgModule({
  declarations: [AuthorizationHomeComponent],
  imports: [CommonModule, SharedModule, AuthorizationRoutingModule],
})
export class AuthorizationModule {}
