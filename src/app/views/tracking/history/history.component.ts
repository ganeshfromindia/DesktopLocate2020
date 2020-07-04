import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';

import { DataService } from '../../../data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyList: Array<any> = [];
  vehicleList: Array<any> = [];
  vehicle : object = {};
  startTime = new Date(this.userService.getCurrentStartTime());
  endTime = new Date(this.userService.getCurrentEndTime());
  userId : Number;

  constructor(private userService: UserService, private activatedRoute : ActivatedRoute, private dataService: DataService) {
    var userDetail = this.userService.getUserDetails(); 
    this.userId = userDetail['id'];
   }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(data => {
      if(data['params'].type && data['params'].from == 'live'){
        this.vehicleList = this.userService.getVehicleList();
        this.getHistory(data['params'].data, this.startTime, this.endTime);        
      }else {
        this.getVehicleList();
      } 
    })  
  }

  mapDataObj;

  getHistory(vehicle, startTime, endTime){

    var sTime = new Date(startTime).getTime();
    var eTime = new Date(endTime).getTime();
    
    let params = new HttpParams().set("userId", this.userId.toString())
    .set("vehicleId", vehicle.id).set("startTime", sTime.toString()).set("endTime", eTime.toString());

    // let params = new HttpParams().set("userId", this.userId.toString())
    // .set("vehicleId", vehicle.id).set("startTime", "1572546600000").set("endTime", "1573324200000");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/history', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.historyList = data['payLoad']; 
         this.mapDataObj = {'eventType' : 'history' , data : data['payLoad']};    
        }
    })
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", this.userId.toString());

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleList = data['payLoad'];
         this.vehicle = this.vehicleList[0];
         this.userService.setVehicleList(this.vehicleList);
         this.getHistory(this.vehicleList[0], this.startTime, this.endTime)
      }else{
         this.vehicleList = [];
      }
    })
  }
}
