import {Component } from '@angular/core';
import { navItems } from '../../_nav';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems;

  constructor(private userService: UserService) {
    console.log(JSON.parse(this.userService.getRoleMenu()));
    this.navItems = navItems;
   }

  toggleMinimize(e) {
   
    this.sidebarMinimized = e;
  }
}
