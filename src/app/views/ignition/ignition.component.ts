import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import { AddressService } from '../../services/address.service';

import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ignition',
  templateUrl: './ignition.component.html',
  styleUrls: ['./ignition.component.css']
})
export class IgnitionComponent implements OnInit {

  vehicleList: Array<any> = [];
  vehicle : object = {};
  startTime = new Date(this.userService.getCurrentStartTime());
  endTime = new Date(this.userService.getCurrentEndTime());
  igntionDayList : Array<any> = []; 
  innerIgntionList : Array<any> = [];
  userId : Number;

  @ViewChild('largeModal') public largeModal: ModalDirective;

  constructor(private userService: UserService,
              private dataService: DataService,
              private addressService : AddressService) {
                var userDetail = this.userService.getUserDetails(); 
                this.userId = userDetail['id'];
               }

  ngOnInit(): void {
    this.getVehicleList();
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", this.userId.toString());

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/list', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleList = data['payLoad'];
         this.vehicle = this.vehicleList[0];
      }else{
         this.vehicleList = [];
      }
    })
  }

  showIgnition(){
    console.log(this.vehicle);

    var data = {"vehicleId":this.vehicle['id'],
                "startTime":this.userService.getStartTime(this.startTime),
                "endTime":this.userService.getEndTime(this.endTime),
                "dayWise":true};

    this.dataService.sendPostRequest('jmc/api/v1/get/vehicle/ignition', data).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.igntionDayList = data['payLoad'];

         if(this.ignitionListIndex != null && this.ignitionListIndex > -1){
          this.innerIgntionList = this.igntionDayList[this.ignitionListIndex].vehicleIgnitionList;      
         }
      }else{
        this.igntionDayList = [];
      }
    })
  }

  ignitionListIndex = null;

  showIgnitionData(list, i){
    if(list.length > 0){
      this.innerIgntionList = list;
    }
    this.ignitionListIndex = i;
  }

  lat: number = 19.21026;
  lng: number = 72.85801;
  latitude : number;
  longitude : number;
  mapAddress = "";
  mapDataObj : any;

  getAddress(element){

    this.latitude = element.latitude;
    this.longitude = element.longitude;

    this.lat = element.latitude;
    this.lng = element.longitude;
    
    if(element.latitude && element.longitude){
      this.addressService
      .getAddress(element.latitude, element.longitude)
      .then(data => {
        try {
          this.mapAddress = data["results"][0]["formatted_address"];
          this.largeModal.show();
          this.mapDataObj = {'eventType' : 'live' , data : [element]};
        } catch (error) {
          this.mapAddress = "No Address Found";
        }
      });
    }
  }

  acceptDeclineData = {};

  acceptIgntion(data ,i){
    if(confirm("Do you want to Accept")) {
      console.log(data);
      console.log(i);

      data['parentUserId'] = 8;
      data['approved'] = true;

      this.dataService.sendPostRequest('jmc/api/v1/update-status/save-report', data).subscribe(data => {
        if (data['message'] == 'SUCCESS') {
           this.showIgnition();
        }else{
          
        }
      })
    }
  }

  declineIgntion(data ,i){
    if(confirm("Do you want to Decline")) {

      data['parentUserId'] = this.userId.toString();
      data['approved'] = false;

      this.dataService.sendPostRequest('jmc/api/v1/update-status/save-report', data).subscribe(data => {
        if (data['message'] == 'SUCCESS') {
           this.showIgnition();
        }else{
          
        }
      })
    }
  }

}