import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminOperationsComponent } from './admin-operations.component';

const routes: Routes = [{ path: '', component: AdminOperationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOperationsRoutingModule { }
