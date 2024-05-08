import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisaComponent } from "./visa.component";


const routes: Routes = [{ path: '', component: VisaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisaRoutingModule { }
