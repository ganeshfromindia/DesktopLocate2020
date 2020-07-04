import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import { HttpParams, HttpClient } from '@angular/common/http';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { AddressService } from '../../services/address.service'

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  vehicleList: Array<any> = [];
  vehicle : object = {};
  startTime = new Date(this.userService.getCurrentStartTime());
  endTime = new Date(this.userService.getCurrentEndTime());
  selectedValue: string;
  distanceTraveledReport : Array<any> = [];
  distanceTraveledEmpty : boolean = false;
  TaskReminderEmpty : boolean = false;
  showTable : boolean = false;
  taskReminderReport: Array<any> = [];
  vehicleStatusEmpty: boolean = false;
  userId : Number;

  downloadList: any[] = [
    { value: 'Dt', viewValue: 'Distance Traveled' },
    { value: 'Ar', viewValue: 'Analytics Report' },
    { value: 'Al', viewValue: 'Alert Report' },
    { value: 'hi', viewValue: 'History Report' },
    { value: 'Tm', viewValue: 'Temperature Report' },
    { value: 'Tk', viewValue: 'Task Reminder Report' },
    { value: 'Vs', viewValue: 'Vehicle Status' }
  ];

  constructor(private userService: UserService, private dataService: DataService,
             private addressService : AddressService,
             private userDetails: UserService) { 
              var userDetail = this.userDetails.getUserDetails(); 
              this.userId = userDetail['id'];
             }

  ngOnInit(): void {

    if(this.userService.getVehicleList()){
      this.vehicleList = this.userService.getVehicleList();
      this.vehicle = this.vehicleList[0];
    }else{
      this.getVehicleList();  
    } 
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", this.userId.toString());

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleList = data['payLoad'];
         this.vehicle = this.vehicleList[0];
         this.userService.setVehicleList(this.vehicleList);
      }else{
         this.vehicleList = [];
      }
    })
  }

  showReport(downloadType){
    if(downloadType && this.userService.getTime(this.startTime) && this.userService.getTime(this.endTime) 
        && this.userService.getTime(this.endTime) > this.userService.getTime(this.startTime)){
          if(this.selectedValue == 'Dt'){
            
            this.getDisatanceTraveled(this.userService.getTime(this.startTime), this.userService.getTime(this.endTime), this.vehicle);
          }else if(this.selectedValue == 'Ar') {
            // this.analyticalReport(event);
          }else if(this.selectedValue == 'Al'){
            // this.getAlertReportData();
          }else if(this.selectedValue == 'Tm'){
    
          }else if(this.selectedValue == 'Dg'){
            // this.getDGSetReport();
          }else if(this.selectedValue == 'Tk'){
            this.getTaskReminderReport(this.userService.getEndTime(this.endTime), this.userId.toString());  
          }else if(this.selectedValue == 'Vs'){
              this._getVehicleStatus(this.vehicle, this.userService.getTime(this.startTime), this.userService.getTime(this.endTime));
          }
        }
    
  }

  downloadReport(downloadType){
    if(downloadType && this.userService.getTime(this.startTime) && this.userService.getTime(this.endTime) 
    && this.userService.getTime(this.endTime) > this.userService.getTime(this.startTime)){
      if(this.selectedValue == 'hi'){
        this.getHistory(this.vehicle, this.userService.getTime(this.startTime), this.userService.getTime(this.endTime));
      }else if(this.selectedValue == 'Tk'){
        this.downloadTaskReminder(this.userService.getCurrentStartTime().toString() ,this.userService.getEndTime(this.endTime), this.userId.toString());  
      }else if(this.selectedValue == 'Vs'){
        this.downloadVehicleStatus(this.vehicle['id'], this.userService.getTime(this.startTime), this.userService.getTime(this.endTime));
      }
    }
  }

  getTaskReminderReport(end, userId){

    if(end && userId){

      let params = new HttpParams().set("userId", userId)
      .set('startTime', this.userService.getCurrentStartTime().toString())
      .set('endTime', end);
  
      this.showTable = true;
      this.taskReminderReport = [];
      this.TaskReminderEmpty = false;
      
      this.dataService.sendPostRequest('jmc/api/v1/task/reminder/report', {}, params).subscribe(data => {
        if (data['status'] == 200 && data['payLoad'].length > 0) {
          this.taskReminderReport = data['payLoad'];
          this.TaskReminderEmpty = false;
        }else{
          this.taskReminderReport = [];
          this.TaskReminderEmpty = true;
        }
      })  
    }
  }

  getDisatanceTraveled(start, end, vehicle){

    this.distanceTraveledReport = [];
    this.distanceTraveledEmpty = false;
    this.showTable = true;

    let params = new HttpParams().set("userId", this.userId.toString())
    .set('startTime', start).set('endTime', end);

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/distance/travelled', [vehicle.id], params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.distanceTraveledReport = data['payLoad'];
        this.distanceTraveledEmpty = false;
      }else{
        this.distanceTraveledEmpty = true;
        this.distanceTraveledReport = [];
      }
    })
  }

  downloadData: any[] = [];
  public locationMap: Map<String, String> = new Map();
  progressWidth = '0%';

  getHistory(vehicle, startTime, endTime){

    var sTime = new Date(startTime).getTime();
    var eTime = new Date(endTime).getTime();
    let fileName = vehicle.vehicleNo + "'s Location Report " + new Date(startTime).toLocaleDateString().replace(new RegExp("/", "g"), '_') + "_to_" + new Date(endTime).toLocaleDateString().replace(new RegExp("/", "g"), '_');

    let params = new HttpParams().set("userId", this.userId.toString())
    .set("vehicleId", vehicle['id']).set("startTime", sTime.toString()).set("endTime", eTime.toString());

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/history', {}, params).subscribe(data => {
      if (data['payLoad'].length > 0) {
             
        this._generateDownloadData(data['payLoad'])
        .then(() => {
          let jsonData = JSON.stringify(this.downloadData);
          var options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: false,
            useBom: true,
            noDownload: false
          };
      
          new Angular5Csv(jsonData, fileName, options);
        })
        }
    })
  }

  _generateDownloadData(data: Array<Object>) {

    let latLngArray: Array<string> = [];
    let uniqueLatLngArray: Array<string> = [];
  
    return new Promise((resolve, reject) => {
  
      this.downloadData = [];
      this.progressWidth = '0%';
      this.downloadData.push({
        "Vehicle Name": this.vehicle['vehicleNo'],
        "Total Distance": this.calculateDistanceTravelled(data).toFixed(2) + " km"
      });
      this.downloadData.push({
        "Trip Distance": "Trip Distance",
        "Start Date": "Start Date",
        "Start Time": "Start Time",
        "End Date": "End Date",
        "End Time": "End Time",
        "Start Address": "Start Address",
        "End Address": "End Address"
      });
  
      // ------------------------- TEST ---------------------------------
  
      for (let i = 0; i < data.length; i++) {
  
        if (data[i]['type'] == 'MOVING') {
  
          let sourceCoords: LatLong = { lat: 0, long: 0 };
          let destCoords: LatLong = { lat: 0, long: 0 };
  
          sourceCoords.lat = Number(Number(data[i]['sourceLat']).toFixed(4));
          sourceCoords.long = Number(Number(data[i]['sourceLong']).toFixed(4));
          /*sourceCoords.lat = data[i]['sourceLat'];
          sourceCoords.long = data[i]['sourceLong'];*/
  
          latLngArray.push(JSON.stringify(sourceCoords));
          if (uniqueLatLngArray.indexOf(JSON.stringify(sourceCoords)) == -1) {
            uniqueLatLngArray.push(JSON.stringify(sourceCoords));
          }
  
          /*destCoords.lat = data[i]['destLat'];
          destCoords.long = data[i]['destLong'];*/
          destCoords.lat = Number(Number(data[i]['destLat']).toFixed(4));
          destCoords.long = Number(Number(data[i]['destLong']).toFixed(4));
  
          latLngArray.push(JSON.stringify(destCoords));
          if (uniqueLatLngArray.indexOf(JSON.stringify(destCoords)) == -1) {
            uniqueLatLngArray.push(JSON.stringify(destCoords));
          }
        } else if (data[i]['type'] == 'STATIC') {
  
          // TODO: TEMP. DELETE
          let staticCoords: LatLong = { lat: 0, long: 0 };
  
          /*staticCoords.lat = data[i]['latitude'];
          staticCoords.long = data[i]['longitude'];*/
          staticCoords.lat = Number(Number(data[i]['sourceLat']).toFixed(4));
          staticCoords.long = Number(Number(data[i]['sourceLong']).toFixed(4));
  
          latLngArray.push(JSON.stringify(staticCoords));
          if (uniqueLatLngArray.indexOf(JSON.stringify(staticCoords)) == -1) {
  
            uniqueLatLngArray.push(JSON.stringify(staticCoords));
          }
        }
      }
  
      // INFO: To make array FIFO
      latLngArray.reverse();
      uniqueLatLngArray.reverse();
  
      let actions = uniqueLatLngArray.map(this._getGeoLocation.bind(this));
      Promise.all(actions)
        .then((addresses) => {
  
          for (let i = 0; i < uniqueLatLngArray.length; i++) {
            this.progressWidth = ((i + 1) / uniqueLatLngArray.length * 100) + "%";
            this.locationMap.set(uniqueLatLngArray[i], String(addresses[i]));
          }
         
  
          // return this.locationMap;
        })
        .then(() => {
  
          for (let i = 0; i < data.length; i++) {
            if (data[i]['type'] == 'MOVING') {
              let source: LatLong = { lat: Number(Number(data[i]['sourceLat']).toFixed(4)), long: Number(Number(data[i]['sourceLong']).toFixed(4)) };
              let dest: LatLong = { lat: Number(Number(data[i]['destLat']).toFixed(4)), long: Number(Number(data[i]['destLong']).toFixed(4)) };
              /*let source : LatLong = {lat : data[i]['sourceLat'], long : data[i]['sourceLong']};
              let dest : LatLong = {lat : data[i]['destLat'], long : data[i]['destLong']};*/
              let rec = {
                "Trip Distance": Number( data[i]['distance'] ) / 1000.0 + " Km",
                "Start Date": new Date(data[i]['startTime']).toLocaleDateString(),
                "Start Time": this.userService.getFormattedTime(data[i]['startTime']),
                "End Date": new Date(data[i]['endTime']).toLocaleDateString(),
                "End Time": this.userService.getFormattedTime(data[i]['endTime']),
                "Start Address": this.locationMap.get(JSON.stringify(source)),
                "End Address": this.locationMap.get(JSON.stringify(dest))
              };
              this.downloadData.push(rec);
  
            } else if (data[i]['type'] == 'STATIC') {
  
              let source: LatLong = { lat: Number(Number(data[i]['sourceLat']).toFixed(4)), long: Number(Number(data[i]['sourceLong']).toFixed(4)) };
              // let source : LatLong = {lat : data[i]['latitude'], long : data[i]['longitude']};
              let rec = {
  
                "Trip Distance": "0.0 Km",
                "Start Date": new Date(data[i]['startTime']).toLocaleDateString(),
                "Start Time": this.userService.getFormattedTime(data[i]['startTime']),
                "End Date": new Date(data[i]['endTime']).toLocaleDateString(),
                "End Time": this.userService.getFormattedTime(data[i]['endTime']),
                "Start Address": this.locationMap.get(JSON.stringify(source)),
                "End Address": this.locationMap.get(JSON.stringify(source))
              };
              this.downloadData.push(rec);
            }//end of else-if
  
          }//end of for-loop
         
  
          resolve();
        })
        .catch((error) => console.log("Error :", error))
  
    });
  }

  private calculateDistanceTravelled(data: Array<Object>) {

    let totalDistance = 0;
    for (let i = 0; i < data.length; i++) {
        
        if (data[i]['type'] != 'STATIC') {
            totalDistance = totalDistance + Number(data[i]['distance']);
        }
    }
    return totalDistance / 1000.0;
  }

  _getGeoLocation(latLong: any): Promise<String> {

    let latLongString: String = latLong;
    latLong = JSON.parse(latLong);

    return new Promise((resolve, reject) => {

      if (this.locationMap.has(latLongString)) {
        resolve(this.locationMap.get(latLongString))
      } else {

        //INFO: Below code works for direct google map api url. DO NOT DELETE.

      
        this.addressService.getAddressHere(latLong['lat'], latLong['long'])
          .then((response) => {
            // if (response.status == "OK") {
            //   if(response.results[0] && response.results[0]['formatted_address']){
            //     console.log(response.results[0]['formatted_address']);
            //     resolve(response.results[0]['formatted_address']);
            //   }else{
            //     resolve("-")
            //   }
            // } else
            //   resolve("-")
            if(response && response.Response && response.Response.View[0] && response.Response.View[0].Result[0]){
              resolve(response.Response.View[0].Result[0].Location.Address.Label)
            }else{
              resolve("-");
            }
          })
      }
    });
  }

    vehicleStatusList : Array<any> = [];
    vehicleStatusTimeCount : Object = {};
  _getVehicleStatus(vehicle, startTime, endTime){

    let params = new HttpParams().set("vehicleId", vehicle.id).set("startTime", startTime).set("endTime", endTime);
    this.showTable = true;
    this.vehicleStatusEmpty = false;
    this.vehicleStatusList = [];
    this.vehicleStatusTimeCount = {};

    this.dataService.sendGetRequest('jmc/api/v1/vehicle/status/report', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad']) {
        this.vehicleStatusList = data['payLoad'].reportList;
        this.vehicleStatusTimeCount = data['payLoad'].statusTimeCount;
        this.vehicleStatusEmpty = false;
      }else{
        this.vehicleStatusEmpty = true;
      }
    })
  }

  downloadTaskReminder(start, end, user){
    window.open( environment.base_url + 'jmc/api/v1/task/reminder/report?userId='+user+'&endTime='+end+'&startTime='+start);
    // window.open("http://localhost:8071/jmc/api/v1/download/voucher?vehicleId=1&startTime=1572856073000&endTime=1572962911000&dayWise=true");
  }

  downloadVehicleStatus(vehicleId, start, end){
    window.open( environment.base_url + 'jmc/api/v1/vehicle/status/report/excel?vehicleIdList='+vehicleId+'&endTime='+end+'&startTime='+start);
    // window.open("http://192.168.0.108:8071/jmc/api/v1/vehicle/status/report/excel?vehicleIdList=10&startTime=1588291200000&endTime=1593475200000");
  }

}

export interface LatLong {

  lat: Number;
  long: Number;

}