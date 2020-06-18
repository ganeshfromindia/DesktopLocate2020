import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { IgnitionComponent } from './ignition.component';
import { IgnitionReportComponent } from './ignition-report.component';
import { DataService } from '../../data.service';
import { TrackingModule } from '../tracking/tracking.module';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view',
    pathMatch: 'full',
  },
  {
    path: 'view',
    component: IgnitionComponent,
    data: {
      title: 'Ignition'
    }
  },
  {
    path: 'report',
    component: IgnitionReportComponent,
    data: {
      title: 'Ignition'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    ModalModule.forRoot(),
    TrackingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers:[DataService],
  declarations: [ IgnitionComponent, IgnitionReportComponent ]
})
export class IgnitionModule { }
