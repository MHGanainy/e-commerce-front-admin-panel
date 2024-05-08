import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminOperationsHomeRoutingModule } from './admin-operations-home-routing.module';
import { AdminOperationsHomeComponent } from './admin-operations-home.component';


@NgModule({
  declarations: [AdminOperationsHomeComponent],
  imports: [
    CommonModule,
    AdminOperationsHomeRoutingModule
  ]
})
export class AdminOperationsHomeModule { }
