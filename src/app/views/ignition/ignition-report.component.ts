import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import { AddressService } from '../../services/address.service';

import {ModalDirective} from 'ngx-bootstrap/modal';

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

    @ViewChild('largeModal') public largeModal: ModalDirective;

    constructor(private userService: UserService,
        private dataService: DataService,
        private addressService : AddressService) { }

        ngOnInit(): void {
            this.getVehicleList();
        }
    
        getVehicleList(){
            let params = new HttpParams().set("userId", "8");
        
            this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
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
        
            var data = 
            // {"vehicleId":2,
            //             "startTime":this.userService.getStartTime(this.startTime),
            //             "endTime":this.userService.getEndTime(this.endTime),
            //             "dayWise":true}
        
                       {"vehicleId":1,"startTime":1572856073000,"endTime":1572962911000,"dayWise":true}
        
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
        
            this.latitude = element.lattitude;
            this.longitude = element.longitude;
        
            this.lat = element.lattitude;
            this.lng = element.longitude;
            
            if(element.lattitude && element.longitude){
              this.addressService
              .getAddress(element.lattitude, element.longitude)
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
        // {"vehicleId":2,
            //             "startTime":this.userService.getStartTime(this.startTime),
            //             "endTime":this.userService.getEndTime(this.endTime),
            //             "dayWise":true}
        
        
        var data = {"vehicleId":1,"startTime":1572856073000,"endTime":1572962911000,"dayWise":true};
        window.open("http://localhost:8071/jmc/api/v1/download/voucher?vehicleId="+data.vehicleId+
                        "&startTime="+data.startTime+"&endTime="+data.endTime+"&dayWise=true");

          }
        
}