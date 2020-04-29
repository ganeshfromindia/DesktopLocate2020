import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertModule } from 'ngx-bootstrap/alert';
import { UserComponent } from './user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { userRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    userRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ UserComponent ]
})
export class userModule { }
