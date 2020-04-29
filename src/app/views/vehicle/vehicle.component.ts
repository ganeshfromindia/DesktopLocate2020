import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service'

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class vehicleComponent implements OnInit {

  vehicleForm: FormGroup;
  submitted = false;
  alertsDismiss: any = [];
  designationList: Array<any> = [];
  vehicleEditId: Number;

  time = {hour: 13, minute: 30};
  meridian = true;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.getManufactureList();
    this.getVehicleDeviceType();
    this.getVehicleTypeList();
    this.getAllProjects()

    this.vehicleForm = this.formBuilder.group({
      vehicleDeviceId: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      assetNo: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      vehicleDeviceType: ['', Validators.required],
      manufacturerId: ['', Validators.required],
      makeModelId: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      fuelTankCapacity: ['', Validators.required],
      projectId : [''],
      manufacturerYear : [''],
      effectiveFrom : [{hour: 13, minute: 30}, Validators.required],
      effectiveTo : [{hour: 14, minute: 30}, Validators.required]
    })
  }

  add(text): void {
    this.alertsDismiss = [];
    this.alertsDismiss.push({
      type: 'warning',
      msg: text,
      timeout: 5000
    });
  }

  public manufactureList: Array<any> = [];
  public makeModelList: Array<any> = [];
  public deviceTypeList: Array<any> = [];
  public vehicleTypeList: Array<any> = [];
  public projectList: Array<any> = [];

  getManufactureList() {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.manufactureList = data['payLoad'];
      }else{
        this.manufactureList = [];
      }
    })
  }

  changeManufacture(event){
   this.getMakeModelFromManufacture(this.vehicleForm.controls['manufacturerId'].value);
   ;
  }

  getMakeModelFromManufacture(manufacture, isEdit?){
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/make-model?manufacturerId='+ manufacture).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.makeModelList = data['payLoad'];
        if(isEdit){
          this.updateVehicleData(isEdit);
        }
      }else{
        this.makeModelList = [];
      }
    })
  }

  getVehicleDeviceType(){
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/device-type').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.deviceTypeList = data['payLoad'];
      }else{
        this.deviceTypeList = [];
      }
    })
  }

  getVehicleTypeList() {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle-type/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.vehicleTypeList = data['payLoad'];
      }
    })
  }

  getAllProjects(){
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }

  submit(){

    if (this.vehicleForm.invalid) { 
      this.add("please add all the required Field!");
    }

    var rawData = this.vehicleForm.getRawValue();    
    var startTime = rawData.effectiveFrom.hour * 60 + rawData.effectiveFrom.minute;
    var endTime = rawData.effectiveTo.hour * 60 + rawData.effectiveTo.minute;

    if(endTime > startTime){
      rawData.effectiveFrom = startTime;
      rawData.effectiveTo = endTime;

      if(this.vehicleEditId){
        rawData.id = this.vehicleEditId;
        this.dataService.sendPutRequest('jmc/api/v1/vehicle/update', rawData).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.vehicleEditId = null;
            this.vehicleForm.reset();
          }else{
            this.add(data['message']);
          }
        })
      }else{
        this.dataService.sendPostRequest('jmc/api/v1/vehicle/save', rawData).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.vehicleForm.reset();
          }else{
            this.add(data['message']);
          }
        })
      }
    }else{
      alert("end time should be greater than start time..");
    }
  }

  onReset() {
    this.submitted = false;
    this.vehicleForm.reset();
  }

  userSelectType: String = "emailId";
  selectedValue : String;

  changeType(event){
   if(event && this.selectedValue){
    this.getVehicle(event, this.selectedValue);
   }
  }


  getVehicle(type, value) {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/get?'+ type + '=' + value).subscribe(data => {
      if (data['status'] == 200) {
        var vehicleData = data['payLoad'];
        console.log(JSON.stringify(vehicleData));  //MH87452
        this.vehicleEditId = vehicleData.id;
        this.getMakeModelFromManufacture(vehicleData.manufacturer.id, vehicleData);
      }
    })
  }

  updateVehicleData(vehicle){
    var Data = {
      vehicleDeviceId: vehicle.vehicleDeviceId,
      vehicleNo: vehicle.vehicleNo,
      assetNo: vehicle.assetNo,
      mobileNumber: vehicle.mobileNumber,
      vehicleDeviceType: vehicle.vehicleDeviceType,
      manufacturerId: vehicle.manufacturer.id,
      makeModelId: vehicle.makeModel.id,
      vehicleTypeId: vehicle.vehicleType.id,
      fuelTankCapacity: vehicle.fuelTankCapacity,
      projectId : vehicle.projectModel.id,
      manufacturerYear : vehicle.manufacturerYear,
      effectiveFrom : {hour: Math.floor(vehicle.effectiveFrom/60), minute: vehicle.effectiveFrom % 60},
      effectiveTo : {hour: Math.floor(vehicle.effectiveTo/60), minute: vehicle.effectiveTo % 60}
    }
    this.vehicleForm.setValue(Data);
    console.log(Data);
  }
}
