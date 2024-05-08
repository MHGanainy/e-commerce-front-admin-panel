import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankApprovalComponent } from './bank-approval.component';


const routes: Routes = [{ path: '', component: BankApprovalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankApprovalRoutingModule { }
