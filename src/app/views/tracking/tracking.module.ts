// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TrackRoutingModule } from './track-routing.module';
import { DataService } from '../../data.service';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbTimepickerModule  } from '@ng-bootstrap/ng-bootstrap';
import { HistoryComponent } from './history/history.component';
import { LiveComponent } from './live/live.component';
import { MapComponent } from './map/map.component';


@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TrackRoutingModule,
    NgbTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAhBskN2Nm9cbEihwCEE4CWE2R-8iGyCTA',  libraries: ['places', 'drawing', 'geometry']
    })
  ],
  providers:[DataService],
  exports: [MapComponent],
  declarations: [
    HistoryComponent,
    LiveComponent,
    MapComponent
  ]
})
export class TrackingModule { }
