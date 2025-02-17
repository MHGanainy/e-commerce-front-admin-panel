import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FailedPaymentsComponent } from './failed-payments.component';

const routes: Routes = [{ path: '', component: FailedPaymentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailedPaymentsRoutingModule { }
