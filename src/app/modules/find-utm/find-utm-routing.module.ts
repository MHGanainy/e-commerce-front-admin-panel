import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindUtmComponent } from './find-utm.component';

const routes: Routes = [{ path: '', component: FindUtmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindUtmRoutingModule { }
