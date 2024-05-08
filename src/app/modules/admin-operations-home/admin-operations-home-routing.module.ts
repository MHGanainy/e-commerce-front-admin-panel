import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminOperationsHomeComponent } from './admin-operations-home.component';

const routes: Routes = [{ path: '', component: AdminOperationsHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOperationsHomeRoutingModule { }
