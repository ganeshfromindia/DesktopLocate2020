import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ProjectComponent } from './project.component';
import { DataService } from '../../data.service';
import { TrackingModule } from '../tracking/tracking.module';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    data: {
      title: 'project'
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
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers:[DataService],
  declarations: [ ProjectComponent ]
})
export class projectModule { }
