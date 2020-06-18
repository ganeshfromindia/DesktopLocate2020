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

  constructor(private userService: UserService, private activatedRoute : ActivatedRoute, private dataService: DataService) { }

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
    
    let params = new HttpParams().set("userId", "8")
    .set("vehicleId", '8').set("startTime", '1577987714000').set("endTime", '1577989777000');

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/history', {}, params).subscribe(data => {
      if (data['payLoad'].length > 0) {
         this.historyList = data['payLoad']; 
         this.mapDataObj = {'eventType' : 'history' , data : data['payLoad']};    
        }
    })
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", "8");

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
