import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryComponent } from './history/history.component';
import { LiveComponent } from './live/live.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tracking'
    },
    children: [
      {
        path: '',
        redirectTo: 'live'
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: {
          title: 'Vehicle Tracking History'
        }
      },
      {
        path: 'live',
        component: LiveComponent,
        data: {
          title: 'Vehicle Live Location'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule {}
