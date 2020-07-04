import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  }
  ,
  {
    name: 'Admin',
    url: '/admin',
    icon: 'fa fa-car',
    children: [
      {
        name: 'User',
        url: '/admin/user',
        icon: 'icon-people'
      },
      {
        name: 'Designation',
        url: '/admin/designation',
        icon: 'icon-star'
      },
      {
        name: 'Type',
        url: '/admin/vehicle/vehicleType',
        icon: 'fa fa-car'
      },
      {
        name: 'Manufacturer',
        url: '/admin/vehicle/vehicleManufacturer',
        icon: 'fa fa-car'
      },
      {
        name: 'Make Model',
        url: '/admin/vehicle/vehicleMakeModel',
        icon: 'fa fa-car'
      },
      {
        name: 'Project',
        url: '/admin/project',
        icon: 'icon-people'
      },
      {
        name: 'Sites',
        url: '/admin/site/map',
        icon: 'icon-people'
      },
      {
        name: 'Vehicle List',
        url: '/admin/list/vehicle',
        icon: 'fa fa-align-justify'
      },
      {
        name: 'Polygon',
        url: '/admin/polygon/create',
        icon: 'fa fa-align-justify'
      },
      {
        name: 'Polygon-Assign',
        url: '/admin/polygon/assign',
        icon: 'fa fa-align-justify'
      },
      {
        name: 'Create Vehicle',
        url: '/admin/vehicle/vehicleCreation',
        icon: 'fa fa-car'
      }
    ]
  },
  {
    name: 'Billing',
    url: '/billing',
    icon: 'fa fa-car',
    children: [
      {
        name: 'Customer Name',
        url: '/billing/customer/create',
        icon: 'fa fa-car'
      },
      {
        name: 'Customer Detail',
        url: '/billing/customer/customer-detail',
        icon: 'fa fa-car'
      },
      {
        name: 'Assign Billing',
        url: '/billing/customer/project-detail',
        icon: 'fa fa-car'
      },
      {
        name: 'Ignition Report',
        url: '/billing/ignition/report',
        icon: 'fa fa-car'
      }
    ]
  },
  {
    name: 'Tracking',
    url: '/track',
    icon: 'fa fa-car',
    children: [
      {
        name: 'Live',
        url: '/track/tracking/live',
        icon: 'fa fa-car'
      },
      {
        name: 'History',
        url: '/track/tracking/history',
        icon: 'fa fa-car'
      },
      {
        name: 'Ignition View',
        url: '/track/ignition/view',
        icon: 'fa fa-car'
      }
    ]
  },
  {
    name: 'Reports',
    url: '/download/report',
    icon: 'fa fa-file'
  },
  {
    name: 'Setting',
    url: '/setting',
    icon: 'fa fa-car',
    children: [
      {
        name: 'List',
        url: '/setting/list/vehicle',
        icon: 'fa fa-align-justify'
      },
      {
        name: 'Task Reminder',
        url: '/setting/notifications/task-reminder',
        icon: 'icon-bell'
      }
    ]
  }







  
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   icon: 'icon-speedometer',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Theme'
  // },
  // {
  //   title: true,
  //   name: 'Components'
  // },
  // {
  //   name: 'Designation',
  //   url: '/designation',
  //   icon: 'icon-star'
  // },
  // {
  //   name: 'User',
  //   url: '/user',
  //   icon: 'icon-people'
  // },
  // {
  //   name: 'Vehicle',
  //   url: '/vehicle',
  //   icon: 'fa fa-car',
  //   children: [
  //     {
  //       name: 'Type',
  //       url: '/vehicle/vehicleType',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Manufacturer',
  //       url: '/vehicle/vehicleManufacturer',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Make Model',
  //       url: '/vehicle/vehicleMakeModel',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Create',
  //       url: '/vehicle/vehicleCreation',
  //       icon: 'fa fa-car'
  //     }
  //   ]
  // },
  // {
  //   name: 'Sites',
  //   url: '/site/map',
  //   icon: 'icon-people'
  // },{
  //   name: 'Project',
  //   url: '/project',
  //   icon: 'icon-people'
  // },{
  //   name: 'List',
  //   url: '/list/vehicle',
  //   icon: 'fa fa-align-justify'
  // },
  // {
  //   name: 'Customer',
  //   url: '/customer',
  //   icon: 'fa fa-car',
  //   children: [
  //     {
  //       name: 'Create',
  //       url: '/customer/create',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Customer-Detail',
  //       url: '/customer/customer-detail',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Assign-Billing',
  //       url: '/customer/project-detail',
  //       icon: 'fa fa-car'
  //     }
  //   ]
  // },
  // {
  //   name: 'Reports',
  //   url: '/download/report',
  //   icon: 'fa fa-file'
  // },
  // {
  //   name: 'Tracking',
  //   url: '/tracking',
  //   icon: 'fa fa-car',
  //   children: [
  //     {
  //       name: 'Live',
  //       url: '/tracking/live',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'History',
  //       url: '/tracking/history',
  //       icon: 'fa fa-car'
  //     }
  //   ]
  // },
  // {
  //   name: 'Ignition',
  //   url: '/ignition',
  //   icon: 'fa fa-car',
  //   children: [
  //     {
  //       name: 'View',
  //       url: '/ignition/view',
  //       icon: 'fa fa-car'
  //     },
  //     {
  //       name: 'Report',
  //       url: '/ignition/report',
  //       icon: 'fa fa-car'
  //     }
  //   ]
  // },
  // {
  //   name: 'Base',
  //   url: '/base',
  //   icon: 'icon-puzzle',
  //   children: [
  //     {
  //       name: 'Cards',
  //       url: '/base/cards',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Carousels',
  //       url: '/base/carousels',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Collapses',
  //       url: '/base/collapses',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Forms',
  //       url: '/base/forms',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Navbars',
  //       url: '/base/navbars',
  //       icon: 'icon-puzzle'

  //     },
  //     {
  //       name: 'Pagination',
  //       url: '/base/paginations',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Popovers',
  //       url: '/base/popovers',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Progress',
  //       url: '/base/progress',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Switches',
  //       url: '/base/switches',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tables',
  //       url: '/base/tables',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tabs',
  //       url: '/base/tabs',
  //       icon: 'icon-puzzle'
  //     },
  //     {
  //       name: 'Tooltips',
  //       url: '/base/tooltips',
  //       icon: 'icon-puzzle'
  //     }
  //   ]
  // },
  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   icon: 'icon-cursor',
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons',
  //       icon: 'icon-cursor'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns',
  //       icon: 'icon-cursor'
  //     },
  //     {
  //       name: 'Brand Buttons',
  //       url: '/buttons/brand-buttons',
  //       icon: 'icon-cursor'
  //     }
  //   ]
  // },
  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   icon: 'icon-pie-chart'
  // },
  // {
  //   name: 'Icons',
  //   url: '/icons',
  //   icon: 'icon-star',
  //   children: [
  //     {
  //       name: 'CoreUI Icons',
  //       url: '/icons/coreui-icons',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'success',
  //         text: 'NEW'
  //       }
  //     },
  //     {
  //       name: 'Flags',
  //       url: '/icons/flags',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Font Awesome',
  //       url: '/icons/font-awesome',
  //       icon: 'icon-star',
  //       badge: {
  //         variant: 'secondary',
  //         text: '4.7'
  //       }
  //     },
  //     {
  //       name: 'Simple Line Icons',
  //       url: '/icons/simple-line-icons',
  //       icon: 'icon-star'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   icon: 'icon-bell',
  //   children: [
  //     {
  //     name: 'Task Reminder',
  //     url: '/notifications/task-reminder',
  //     icon: 'icon-bell'
  //   },
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges',
  //       icon: 'icon-bell'
  //     },
  //     {
  //       name: 'Modals',
  //       url: '/notifications/modals',
  //       icon: 'icon-bell'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   icon: 'icon-calculator',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'Extras',
  // },
  // {
  //   name: 'Pages',
  //   url: '/pages',
  //   icon: 'icon-star',
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'icon-star'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'icon-star'
  //     }
  //   ]
  // },
  // {
  //   name: 'Disabled',
  //   url: '/dashboard',
  //   icon: 'icon-ban',
  //   badge: {
  //     variant: 'secondary',
  //     text: 'NEW'
  //   },
  //   attributes: { disabled: true },
  // }
  // ,
  // {
  //   name: 'Download CoreUI',
  //   url: 'http://coreui.io/angular/',
  //   icon: 'icon-cloud-download',
  //   class: 'mt-auto',
  //   variant: 'success',
  //   attributes: { target: '_blank', rel: 'noopener' }
  // },
  // {
  //   name: 'Try CoreUI PRO',
  //   url: 'http://coreui.io/pro/angular/',
  //   icon: 'icon-layers',
  //   variant: 'danger',
  //   attributes: { target: '_blank', rel: 'noopener' }
  // }
];
