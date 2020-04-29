import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { DesignationComponent } from './designation.component';
import { designationRoutingModule } from './designation-routing.module';
import { DataService } from '../../data.service';

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    designationRoutingModule,
    FormsModule
  ],
  providers:[DataService],
  declarations: [ DesignationComponent ]
})
export class designationModule { }
