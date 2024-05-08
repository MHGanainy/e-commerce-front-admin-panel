import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "src/app/shared/shared.module";

import { ChangePasswordComponent } from "./components/change-password/change-password.component";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";

@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent],
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, LoginRoutingModule],
})
export class LoginModule {}
