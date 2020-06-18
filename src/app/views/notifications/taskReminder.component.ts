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
  taskList : Array<any> = [];

  constructor(private userService: UserService, private dataService: DataService) { }


  ngOnInit(): void {

    // if(this.userService.getVehicleList()){
    //   this.vehicleList = this.userService.getVehicleList();
    //   this.vehicle = this.vehicleList[0];
    //   this.getSavedTaskList(this.vehicle);
    // }else{
    //   this.getVehicleList();  
    // } 

    this.getVehicleList();
  }

  taskInIt(){
    this.insuranceDate = new Date(this.userService.getCurrentStartTime());
    this.serviceDate = new Date(this.userService.getCurrentStartTime());
    this.oilChangeDate = new Date(this.userService.getCurrentStartTime()); 
    this.passingDate = new Date(this.userService.getCurrentStartTime());
    this.pucDate = new Date(this.userService.getCurrentStartTime());
    this.oilChangeDistnce = null; 
    this.serviceChangeDistance = null;
  }

  getVehicleList(){
    let params = new HttpParams().set("userId", "8");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/list', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleList = data['payLoad'];
         this.vehicle = this.vehicleList[0];
         this.getSavedTaskList(this.vehicle);
         this.userService.setVehicleList(this.vehicleList);
      }else{
         this.vehicleList = [];
      }
    })
  }

  getSavedTaskList(vehicle){
    console.log(vehicle);
    let params = new HttpParams().set("userId", "8").set("vehicleId", vehicle.id);

    this.dataService.sendPostRequest('jmc/api/v1/task/reminder/get', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.taskList = data['payLoad'];
      }else{
         this.taskList = [];
      }
    })
  }

  isEdit : boolean = false;
  taskType;
  taskId : Number; 
  editTask(task){
    this.taskId = task.id;
    this.isEdit = true;
    this.taskType = task.taskType;
    this.fillTask(task);
  }

  fillTask(task){
    if(task.taskType == "VEHICLE_INSURANCE"){
      this.insuranceDate = new Date(task.activityDuration);
    }else{
      this.insuranceDate = null;
    }

    if(task.taskType == "VEHICLE_SERVICE"){
      this.serviceDate = new Date(task.activityDuration);
    }else{
      this.serviceDate = null;
    }

    if(task.taskType == "VEHICLE_OIL_CHANGE"){
      this.oilChangeDate = new Date(task.activityDuration);
    }else{
      this.oilChangeDate = null;
    }

    if(task.taskType == "VEHICLE_PASSING"){
      this.passingDate = new Date(task.activityDuration);
    }else{
      this.passingDate = null;
    }

    if(task.taskType == "VEHICLE_PUC"){
      this.pucDate = new Date(task.activityDuration);
    }else{
      this.pucDate = null;
    }

    if(task.taskType == "VEHICLE_SERVICE_DISTANCE"){
      this.serviceChangeDistance = task.activityDuration;
    }else{
      this.serviceChangeDistance = null;
    }

    if(task.taskType == "VEHICLE_OIL_CHANGE_DISTANCE"){
      this.oilChangeDistnce = task.activityDuration;
    }else{
      this.oilChangeDistnce = null;
    }
  }

  submit(){

    var data = {"vehicleId" : this.vehicle['id'], "taskType" : "", "activityDuration" : null, "active" : true};
    var taskReminderList = [];
    if(this.insuranceDate && !this.isEdit){
      data.taskType = "VEHICLE_INSURANCE";
      data.activityDuration = this.userService.getTime(this.insuranceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_INSURANCE"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_INSURANCE";
      data.activityDuration = this.userService.getTime(this.insuranceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.serviceDate && !this.isEdit){
      data.taskType = "VEHICLE_SERVICE";
      data.activityDuration = this.userService.getTime(this.serviceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_SERVICE"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_SERVICE";
      data.activityDuration = this.userService.getTime(this.serviceDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.oilChangeDate && !this.isEdit){
      data.taskType = "VEHICLE_OIL_CHANGE";
      data.activityDuration = this.userService.getTime(this.oilChangeDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_OIL_CHANGE"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_OIL_CHANGE";
      data.activityDuration = this.userService.getTime(this.oilChangeDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.passingDate && !this.isEdit){
      data.taskType = "VEHICLE_PASSING";
      data.activityDuration = this.userService.getTime(this.passingDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_PASSING"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_PASSING";
      data.activityDuration = this.userService.getTime(this.passingDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.pucDate && !this.isEdit){
      data.taskType = "VEHICLE_PUC";
      data.activityDuration = this.userService.getTime(this.pucDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_PUC"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_PUC";
      data.activityDuration = this.userService.getTime(this.pucDate);
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.serviceChangeDistance && !this.isEdit){
      data.taskType = "VEHICLE_SERVICE_DISTANCE";
      data.activityDuration = this.serviceChangeDistance;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_SERVICE_DISTANCE"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_SERVICE_DISTANCE";
      data.activityDuration = this.serviceChangeDistance;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    if(this.oilChangeDistnce && !this.isEdit){
      data.taskType = "VEHICLE_OIL_CHANGE_DISTANCE";
      data.activityDuration = this.oilChangeDistnce;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }else if(this.taskType == "VEHICLE_OIL_CHANGE_DISTANCE"){
      data['id'] = this.taskId;
      data.taskType = "VEHICLE_OIL_CHANGE_DISTANCE";
      data.activityDuration = this.oilChangeDistnce;
      taskReminderList.push(JSON.parse(JSON.stringify(data)));
    }

    this.dataService.sendPostRequest('jmc/api/v1/task/reminder/save', taskReminderList).subscribe(data => {
      if (data['status'] == 200) {
        this.isEdit = false;
      }else{
       
      }
    })
  }


  onReset(){
    
  }

  showImage(imageType){
    console.log(imageType);
  }
}
