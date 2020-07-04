import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },

  {
    path: 'admin',
    component: DefaultLayoutComponent,
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: 'user',
        loadChildren: () => import('./views/user/user.module').then(m => m.userModule)
      },
      {
        path: 'designation',
        loadChildren: () => import('./views/designation/designation.module').then(m => m.designationModule)
      },
      {
        path: 'vehicle',
        loadChildren: () => import('./views/vehicle/vehicle.module').then(m => m.VehicleModule)
      },
      {
        path: 'site',
        loadChildren: () => import('./views/sites/sites.module').then(m => m.SiteModule)
      },
      {
        path: 'project',
        loadChildren: () => import('./views/project/project.module').then(m => m.projectModule)
      },
      {
        path: 'list',
        loadChildren: () => import('./views/vehicle-list/vehicle-list.module').then(m => m.vehicleListModule)
      },
      {
        path: 'polygon',
        loadChildren: () => import('./views/polygon/polygon.module').then(m => m.polygonModule)
      },
    ]
  },
  {
    path: 'billing',
    component: DefaultLayoutComponent,
    data: {
      title: 'Billing'
    },
    children: [
      {
        path: 'customer',
        loadChildren: () => import('./views/customer/customer.module').then(m => m.CustomerModule)
      },      
      {
        path: 'ignition',
        loadChildren: () => import('./views/ignition/ignition.module').then(m => m.IgnitionModule)
      }
    ]
  },
  {
    path: 'track',
    component: DefaultLayoutComponent,
    data: {
      title: 'Tracking'
    },
    children: [
      {
        path: 'tracking',
        loadChildren: () => import('./views/tracking/tracking.module').then(m => m.TrackingModule)
      },      
      {
        path: 'ignition',
        loadChildren: () => import('./views/ignition/ignition.module').then(m => m.IgnitionModule)
      }
    ]
  },
  {
    path: 'setting',
    component: DefaultLayoutComponent,
    data: {
      title: 'Setting'
    },
    children: [
      {
        path: 'list',
        loadChildren: () => import('./views/vehicle-list/vehicle-list.module').then(m => m.vehicleListModule)
      },{
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      
      {
        path: 'download',
        loadChildren: () => import('./views/reports/reports.module').then(m => m.reportModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
