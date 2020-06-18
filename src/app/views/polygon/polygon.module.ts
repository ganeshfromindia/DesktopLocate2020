import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { PolygonComponent } from './polygon.component';
import { PolygonAssignComponent } from './polygon-assign.component';

import { DataService } from '../../data.service';
import { TrackingModule } from '../tracking/tracking.module';
import { ReactiveFormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: PolygonComponent,
    data: {
      title: 'polygon'
    }
  },
  {
    path: 'assign',
    component: PolygonAssignComponent,
    data: {
      title: 'Polygon-Assign'
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
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAhBskN2Nm9cbEihwCEE4CWE2R-8iGyCTA',  libraries: ['places', 'drawing', 'geometry']
    })
  ],
  providers:[DataService],
  declarations: [ PolygonComponent, PolygonAssignComponent ]
})
export class polygonModule { }
