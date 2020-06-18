import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { CustomerComponent } from './customer.component';
import { CustomerDetailsComponent } from './customer-details.component';
import { DataService } from '../../data.service';
import { TrackingModule } from '../tracking/tracking.module';
import { ProjectDetailsComponent } from './project-details.component'
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: CustomerComponent,
    data: {
      title: 'Customer'
    }
  },
  {
    path: 'customer-detail',
    component: CustomerDetailsComponent,
    data: {
      title: 'Customer-Detail'
    }
  },
  {
    path: 'project-detail',
    component: ProjectDetailsComponent,
    data: {
      title: 'project-Detail'
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
    CollapseModule.forRoot(),
    TrackingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule
  ],
  providers:[DataService],
  declarations: [ CustomerComponent, CustomerDetailsComponent, ProjectDetailsComponent ]
})
export class CustomerModule { }
