import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../../user.service';
import { Router } from '@angular/router';

import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  vehicleData: any = [];

  constructor(private dataService: DataService, private userService: UserService, private router: Router, private mapsAPILoader: MapsAPILoader) { }

  mapDataObj : any;

  ngOnInit(): void {
    this.getLiveData();  
  }

  getLiveData(){
    let params = new HttpParams().set("userId", "8");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleData = data['payLoad'];
         this.mapDataObj = {'eventType' : 'live' , data : this.vehicleData};
         this.userService.setVehicleList(this.vehicleData);
      }else{
         this.vehicleData = [];
      }
    })
  }

  getHistory(data){
    this.router.navigate(['/tracking/history', {type: 'live' , data : data}]);
  }

}
