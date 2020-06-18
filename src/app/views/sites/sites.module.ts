import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { SitesComponent } from './sites.component';
import { DataService } from '../../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TrackingModule } from '../tracking/tracking.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    component: SitesComponent,
    data: {
      title: 'Site'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TrackingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers:[DataService],
  declarations: [ SitesComponent ]
})
export class SiteModule { }
