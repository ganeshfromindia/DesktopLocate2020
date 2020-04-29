import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTypeComponent } from './vehicle_type.component';
import { VehicleManufactureComponent } from './vehicle_manufacture.component';
import { VehicleMakeModelComponent } from './vehicle_make_model.component';
import { vehicleComponent } from './vehicle.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vehicle'
    },
    children: [
      {
        path: '',
        redirectTo: 'vehicleType'
      },
      {
        path: 'vehicleCreation',
        component: vehicleComponent,
        data: {
          title: 'Vehicle Create'
        }
      },
      {
        path: 'vehicleType',
        component: VehicleTypeComponent,
        data: {
          title: 'Vehicle Type'
        }
      },
      {
        path: 'vehicleManufacturer',
        component: VehicleManufactureComponent,
        data: {
          title: 'Vehicle Manufacturer'
        }
      },
      {
        path: 'vehicleMakeModel',
        component: VehicleMakeModelComponent,
        data: {
          title: 'Vehicle Make Model'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule {}
