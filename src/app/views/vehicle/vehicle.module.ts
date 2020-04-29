// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { vehicleComponent } from './vehicle.component';
import { VehicleTypeComponent } from './vehicle_type.component';
import { VehicleManufactureComponent } from './vehicle_manufacture.component';
import { VehicleMakeModelComponent } from './vehicle_make_model.component';
import { DataService } from '../../data.service';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbTimepickerModule  } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    VehicleRoutingModule,
    NgbTimepickerModule
  ],
  providers:[DataService],
  declarations: [
    vehicleComponent,
    VehicleTypeComponent,
    VehicleManufactureComponent,
    VehicleMakeModelComponent
  ]
})
export class VehicleModule { }
