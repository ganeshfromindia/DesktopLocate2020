import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-task-reminder',
  templateUrl: './taskReminder.component.html',
  styleUrls: ['./notification.component.css']
})
export class TaskReminderComponent {

  vehicleList: Array<any> = [];
  vehicle : object = {};
  insuranceDate : Date = new Date(this.userService.getCurrentStartTime());
  serviceDate : Date = new Date(this.userService.getCurrentStartTime());
  oilChangeDate : Date = new Date(this.userService.getCurrentStartTime());
  passingDate : Date = new Date(this.userService.getCurrentStartTime());
  pucDate : Date = new Date(this.userService.getCurrentStartTime());
  oilChangeDistnce : Number;
  serviceChangeDistance : Number;

  constructor(private userService: UserService, private dataService: DataService) { }


  ngOnInit(): void {

    if(this.userService.getVehicleList()){
      this.vehicleList = this.userService.getVehicleList();
      this.vehicle = this.vehicleList[0];
    }else{
      this.getVehicleList();  
    } 
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", "8");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payload'].length > 0) {
         this.vehicleList = data['payload'];
         this.vehicle = this.vehicleList[0];
         this.userService.setVehicleList(this.vehicleList);
      }else{
         this.vehicleList = [];
      }
    })
  }

  submit(){

    var data = {"vehicleId" : this.vehicle['id'], "taskType" : "", "activityDuration" : null, "active" : true};
    var taskReminderList = [];
    if(this.insuranceDate){
      data.taskType = "VEHICLE_INSURANCE";
      data.activityDuration = this.userService.getTime(this.insuranceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.serviceDate){
      data.taskType = "VEHICLE_SERVICE";
      data.activityDuration = this.userService.getTime(this.serviceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.oilChangeDate){
      data.taskType = "VEHICLE_OIL_CHANGE";
      data.activityDuration = this.userService.getTime(this.oilChangeDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.passingDate){
      data.taskType = "VEHICLE_PASSING";
      data.activityDuration = this.userService.getTime(this.passingDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.pucDate){
      data.taskType = "VEHICLE_PUC";
      data.activityDuration = this.userService.getTime(this.pucDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.serviceChangeDistance){
      data.taskType = "VEHICLE_SERVICE_DISTANCE";
      data.activityDuration = this.serviceChangeDistance;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.oilChangeDistnce){
      data.taskType = "VEHICLE_OIL_CHANGE_DISTANCE";
      data.activityDuration = this.oilChangeDistnce;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    this.dataService.sendPostRequest('jmc/api/v1/task/reminder/save', taskReminderList).subscribe(data => {
      if (data['status'] == 200) {
       
      }else{
       
      }
    })
  }
}
