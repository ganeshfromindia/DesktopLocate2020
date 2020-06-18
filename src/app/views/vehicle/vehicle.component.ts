import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service'
import { UploadFileService } from '../../services/upload-file.service';
import {ModalDirective} from 'ngx-bootstrap/modal';

import { HttpParams, HttpClient } from '@angular/common/http';

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
  @ViewChild('largeModal') public largeModal: ModalDirective;

  time = {hour: 13, minute: 30};
  meridian = true;

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
              private uploadFileService : UploadFileService) { }

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
      siteId : [''],
      effectiveFrom : [{hour: 13, minute: 30}, Validators.required],
      effectiveTo : [{hour: 14, minute: 30}, Validators.required],
      vehicleInsurance: [''],
      pucImage: ['']
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
  public siteList: Array<any> = [];

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
  }

  getMakeModelFromManufacture(manufacture, isEdit?){
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/make-model?manufacturerId='+ manufacture).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.makeModelList = data['payLoad'];
        
        this.makeModelBoolean = true
        if(this.siteBoolean && this.editFlag && this.makeModelBoolean){
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
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }

  projectChange(value){
    this.getSite(value);
  }

  siteBoolean : boolean = false;
  editFlag : boolean = false;
  makeModelBoolean : boolean = false;

  getSite(id, editData?){
    let params = new HttpParams().set("projectId", id);
    this.dataService.sendGetRequest('jmc/api/v1/site/get',params).subscribe(data => {
      if (data['status'] == 200) {
        this.siteList = data['payLoad'];

        this.siteBoolean = true;
        if(this.siteBoolean && this.editFlag && this.makeModelBoolean && editData){
          this.updateVehicleData(editData);  
        }
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
       
        if(this.insuranceImageId && this.insuranceImageName.indexOf('jmc/api/v1') == -1){
          this.upload(this.insuranceImage, this.vehicleEditId, 'VEHICLE_INSURANCE', this.insuranceImageId);
          this.insuranceImage = null;
          this.insuranceImageId = null; 
          this.insuranceImageName = '';
        }else if(this.insuranceImageName.indexOf('jmc/api/v1') == -1){
          this.upload(this.insuranceImage, this.vehicleEditId, 'VEHICLE_INSURANCE', this.insuranceImageId);
          this.insuranceImage = null;
          this.insuranceImageId = null; 
          this.insuranceImageName = '';
        }

        if(this.pucImageId && this.pucImageName.indexOf('jmc/api/v1') == -1){
          this.upload(this.pucImage, this.vehicleEditId, 'VEHICLE_PUC', this.pucImageId);    
          this.pucImage = null;
          this.pucImageId = null;      
          this.pucImageName = '';
        }else if(this.pucImageName.indexOf('jmc/api/v1') == -1){
          this.upload(this.pucImage, this.vehicleEditId, 'VEHICLE_PUC', this.pucImageId);    
          this.pucImage = null;
          this.pucImageId = null;      
          this.pucImageName = '';
        }

      }else{
        this.dataService.sendPostRequest('jmc/api/v1/vehicle/save', rawData).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            if(this.insuranceImage){
              this.upload(this.insuranceImage, data['payLoad'].id, 'VEHICLE_INSURANCE');
            }

            if(this.pucImage){
              this.upload(this.pucImage, data['payLoad'].id, 'VEHICLE_PUC');
            }
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

  upload(image, vehicleId, imageType, editId?) {
    const file = image.item(0);
    this.uploadFileService.uploadfile(file, vehicleId, imageType,editId);
  }

  onReset() {
    this.submitted = false;
    this.insuranceImageId = null;
    this.pucImageId = null;
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
        
        this.vehicleEditId = vehicleData.id;
        this.getMakeModelFromManufacture(vehicleData.manufacturer.id, vehicleData);
        if(vehicleData.project && vehicleData.project.id){
          this.getSite(vehicleData.project.id, vehicleData)
        }else{
          this.siteBoolean = true;
        } 
        this.editFlag = true;
        if(this.siteBoolean && this.editFlag && this.makeModelBoolean){
        
          this.updateVehicleData(vehicleData);  
        }
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
      projectId : vehicle.project ? vehicle.project.id ? vehicle.project.id : null : null,
      siteId : vehicle.site ? vehicle.site.id ? vehicle.site.id : null : null,
      manufacturerYear : vehicle.manufacturerYear,
      effectiveFrom : {hour: Math.floor(vehicle.effectiveFrom/60), minute: vehicle.effectiveFrom % 60},
      effectiveTo : {hour: Math.floor(vehicle.effectiveTo/60), minute: vehicle.effectiveTo % 60},
      vehicleInsurance: vehicle.insuranceImagePath,
      pucImage: vehicle.pucImagePath
    }

    if(vehicle.insuranceImagePath){
      this.insuranceImageName = vehicle.insuranceImagePath;
      this.insuranceImageId = vehicle.insuranceImageId;
    }
    if(vehicle.pucImagePath){
      this.pucImageName = vehicle.pucImagePath;
      this.pucImageId = vehicle.pucImageId;
    }


    
    this.vehicleForm.setValue(Data);
  }

  insuranceImage: FileList;
  insuranceImageName : any = '';
  pucImage: FileList;
  pucImageName : any = '';
  commonImageName: any = '';
  insuranceImageId: Number;
  pucImageId: Number;

  thumbnailFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.insuranceImageName = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.vehicleForm.patchValue({'vehicleInsurance' : event.target.value});
      this.insuranceImage = event.target.files;
    }
  }

  detailImageFile(event){

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event: ProgressEvent) => {
        this.pucImageName = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.vehicleForm.patchValue({'pucImage' : event.target.value});
      this.pucImage = event.target.files;
    }
  }

  showImage(imageType){
    this.commonImageName = "";
    if(imageType == 'insuranceImage'){
      this.commonImageName = this.insuranceImageName;
    }else if(imageType == 'pucImage'){
      this.commonImageName = this.pucImageName;
    }
     
    this.largeModal.show();    
  }

  deleteImage(imageType){
    if(imageType == 'insuranceImage'){
      this.commonImageName = "";
      this.insuranceImageName = "";
      this.insuranceImage = null;
      this.vehicleForm.patchValue({'vehicleInsurance' : ""});
    }else if(imageType == 'pucImage'){
      this.commonImageName = "";
      this.pucImageName = "";
      this.pucImage = null;
      this.vehicleForm.patchValue({'pucImage' : ""});
    }
  }
}
