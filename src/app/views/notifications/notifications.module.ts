// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertsComponent } from './alerts.component';

import { BadgesComponent } from './badges.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalsComponent } from './modals.component';

// Notifications Routing
import { NotificationsRoutingModule } from './notifications-routing.module';

import { TaskReminderComponent } from './taskReminder.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule
  ],
  declarations: [
    AlertsComponent,
    BadgesComponent,
    ModalsComponent,
    TaskReminderComponent
  ]
})
export class NotificationsModule { }
