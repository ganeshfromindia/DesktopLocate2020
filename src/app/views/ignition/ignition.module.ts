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
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY',
  fullPickerInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm:ss',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

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
    OwlMomentDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers:[DataService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
  declarations: [ IgnitionComponent, IgnitionReportComponent ]
})
export class IgnitionModule { }
