import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';

import { ReportsComponent } from './reports.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TrackingModule } from '../tracking/tracking.module';

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD/MM/YYYY',
  fullPickerInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'HH:mm:ss',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

import { KeysPipe } from '../../user.service'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report',
    pathMatch: 'full',
  },
  {
    path: 'report',
    component: ReportsComponent,
    data: {
      title: 'Report'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    OwlNativeDateTimeModule,
    ModalModule.forRoot(),
    TrackingModule
  ],
  providers:[DataService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
  declarations: [ ReportsComponent, KeysPipe ]
})
export class reportModule { }
