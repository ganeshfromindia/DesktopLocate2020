import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';

import { ReportsComponent } from './reports.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

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
    OwlNativeDateTimeModule,
  ],
  providers:[DataService],
  declarations: [ ReportsComponent, KeysPipe ]
})
export class vehicleListModule { }
