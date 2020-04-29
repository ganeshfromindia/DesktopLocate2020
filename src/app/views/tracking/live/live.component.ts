import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  vehicleData: any = [];

  constructor(private dataService: DataService, private userService: UserService, private router: Router) { }

  mapDataObj : any;

  ngOnInit(): void {
    this.getLiveData();  
  }

  getLiveData(){
    let params = new HttpParams().set("userId", "8");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payload'].length > 0) {
         this.vehicleData = data['payload'];
         this.mapDataObj = {'eventType' : 'live' , data : this.vehicleData};
         this.userService.setVehicleList(this.mapDataObj);
      }else{
         this.vehicleData = [];
      }
    })
  }

  getHistory(data){
    this.router.navigate(['/tracking/history', {type: 'live' , data : data}]);
  }

}
