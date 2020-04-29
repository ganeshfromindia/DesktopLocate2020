import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { VehicleListComponent } from './vehicle-list.component';
import { DataService } from '../../data.service';
import { TrackingModule } from '../tracking/tracking.module';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicle',
    pathMatch: 'full',
  },
  {
    path: 'vehicle',
    component: VehicleListComponent,
    data: {
      title: 'List'
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
    TrackingModule
  ],
  providers:[DataService],
  declarations: [ VehicleListComponent ]
})
export class vehicleListModule { }
