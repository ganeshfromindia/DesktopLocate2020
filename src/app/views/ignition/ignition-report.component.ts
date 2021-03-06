import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import { AddressService } from '../../services/address.service';

import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ignition-report',
  templateUrl: './ignition-report.component.html',
  styleUrls: ['./ignition.component.css']
})
export class IgnitionReportComponent implements OnInit {

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

            var data = 
            {"vehicleId":this.vehicle['id'],
                        "startTime":this.userService.getStartTime(this.startTime),
                        "endTime":this.userService.getEndTime(this.endTime),
                        "dayWise":true}
        
            this.dataService.sendPostRequest('jmc/api/v1/get/vehicle/ignition-report', data).subscribe(data => {
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
          noIgnitionData = false;
        
          showIgnitionData(list, i){
            this.ignitionListIndex = null;
            if(list && list.length > 0){
              this.innerIgntionList = list;
              this.ignitionListIndex = i;
              this.noIgnitionData = false;
            }else{
              this.innerIgntionList = [];
              this.noIgnitionData = true;
            }
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



      DownloadVoucher(){
        
        var data = {"vehicleId":this.vehicle['id'], "startTime":this.userService.getStartTime(this.startTime),
                    "endTime":this.userService.getEndTime(this.endTime), "dayWise":true};

        window.open(environment.base_url +"/jmc/api/v1/download/voucher?vehicleId="+data.vehicleId+
                        "&startTime="+data.startTime+"&endTime="+data.endTime+"&dayWise=true");

          }

          DownloadExcel(){
            var data = {"vehicleId":this.vehicle['id'], "startTime":this.userService.getStartTime(this.startTime),
            "endTime":this.userService.getEndTime(this.endTime), "dayWise":true};
            window.open( environment.base_url + 'jmc/api/v1/get/vehicle/ignition-report/excel?vehicleIdList='+data.vehicleId
            +'&startTime='+data.startTime+'&endTime='+data.endTime);
          }
        
}