import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./customer.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  vehicleData: any = [];
  customerList : Array<any> = [];
  customerDetailList : Array<any> = [];
  AssignBillingForm: FormGroup;
  vehicleConditionForm: FormGroup;
  vehicleId : Number;

  vehicleConditionList: Array<any> = [];
  vehicleStatusList: Array<any> = [];
  userId : Number;

  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('vehicleStatusModel') public vehicleStatusModel: ModalDirective;


  constructor(private dataService: DataService, private userService: UserService, private formBuilder: FormBuilder,
    private userDetails: UserService) {
      var userDetail = this.userDetails.getUserDetails(); 
      this.userId = userDetail['id'];
   }

  ngOnInit(): void {
  
    this.getLiveData();
    this.getCustomerList();
    this.createForm();
    this.createVehicleConditionForm();
    this.getVehicleConditionList();
    this.getVehicleStatusList();
    this.getAllProjects();
  }


  getLiveData(projectId?, siteId?, vehicleStatus?){
    let params = new HttpParams({
      fromObject : {
        "userId": this.userId.toString()
      }
    })
    
    if(projectId){
      params = params.append("projectId", projectId);
    }

    if(siteId){
      params = params.append("siteId", siteId);
    }

    if(vehicleStatus){
      params = params.append("vehicleStatus", vehicleStatus);
    }

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/list', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.vehicleListCopy = JSON.parse(JSON.stringify(data['payLoad']));
         this.createPaginationList(data['payLoad']);
      }else{
         this.vehicleData = [];
      }
    })
  }

  getCustomerList() {
    let params = new HttpParams().set("userId", this.userId.toString());
    this.dataService.sendGetRequest('jmc/api/v1/customer/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.customerList = data['payLoad'];
      }
    })
  }

  getCustomerDetail(value, isEdit?) {

    if(value){
      let params = new HttpParams().set("customerId", value);
      this.dataService.sendGetRequest('jmc/api/v1/customer/detail/get', params).subscribe(data => {
        if (data['status'] == 200) {
          this.customerDetailList = data['payLoad'];
          this.customerDetailBoolean = true;
          if(isEdit){
            this.updateBillingData(isEdit);  
          }        
        }else{
          this.customerDetailList = [];
        }
      })
    }

  }

  editFlag : boolean = false;
  customerDetailBoolean : boolean = false;
  addBillingData(id){
    this.editFlag = false;
    this.onReset();
    let params = new HttpParams().set("vehicleId", id);

    this.dataService.sendGetRequest('jmc/api/v1/assigned/billing/data', params).subscribe(data => {
      if (data['message'] == 'SUCCESS') {
        this.editFlag = true;
        this.getCustomerDetail(data['payLoad'].customerId, data['payLoad']);       
        if(this.customerDetailBoolean && this.editFlag){
          this.updateBillingData(data['payLoad']);  
        }

      }else{
         
      }
    })

    this.vehicleId = id;
    this.largeModal.show();
  }


  

  updateBillingData(data){
    
    var editData = {
      id: data.id,
      customerId: data.customerId,
      billAddress: this.customerDetailList.find(x => x.id == data.customerDetailId),
      siteAddress: "",
      workOrderNo : data.workOrderNo,
      workOrderDate : new Date(data.workOrderDate),
      AmmendmentDate: new Date(data.ammendmentDate),
      billingDescription: data.billingDescription,
      subDescription: data.subBillingDescription,
      perHourBilling: data.perHourBilling,
      NormalRate: data.normalRate,
      OverTimeRate: data.overTimeRate,
      perMonthBillingRate: data.perMonthBillingRate,
      cgst: data.cgst,
      sgst: data.sgst,
      igst: data.igst,
    }

    this.AssignBillingForm.patchValue(editData);
  }

  createForm(){
    this.AssignBillingForm = this.formBuilder.group({
      id: [null],
      customerId: ['', Validators.required],
      billAddress: ['', Validators.required],
      siteAddress: [{value: '', disabled: true}, Validators.required],
      workOrderNo : ['', Validators.required],
      workOrderDate : [new Date(this.userService.getCurrentStartTime()), Validators.required],
      AmmendmentDate: [new Date(this.userService.getCurrentStartTime()), Validators.required],
      billingDescription: [''],
      subDescription: [''],
      perHourBilling: [false],
      NormalRate: [''],
      OverTimeRate: [''],
      perMonthBillingRate: [''],
      state : [{value: '', disabled: true}],
      cgst: [''],
      sgst: [''],
      igst: [''],
    })
  }

  createVehicleConditionForm(){
    this.vehicleConditionForm = this.formBuilder.group({
      id: [null],
      vehicleStatus: ['', Validators.required],
      vehicleCondition: ['', Validators.required],
      fromdate: [new Date(this.userService.getCurrentStartTime()), Validators.required],
      toDate: [new Date(this.userService.getCurrentStartTime())]
    })
  }

  selectBillAddress(event){
    console.log(event);
    console.log(this.AssignBillingForm.controls['billAddress'].value);
    this.AssignBillingForm.patchValue({
      siteAddress: this.AssignBillingForm.controls['billAddress'].value.siteAddress,
      state : this.AssignBillingForm.controls['billAddress'].value.stateCode,
      igst : '',
      cgst : '',
      sgst : ''
    });

    if(this.AssignBillingForm.controls['billAddress'].value.stateCode == 'MH' ){
      this.AssignBillingForm.controls['igst'].disable();
      this.AssignBillingForm.controls['cgst'].enable();
      this.AssignBillingForm.controls['sgst'].enable();
    }else{
      this.AssignBillingForm.controls['igst'].enable();
      this.AssignBillingForm.controls['cgst'].disable();
      this.AssignBillingForm.controls['sgst'].disable();
    }
  }

  submit(){
    console.log(this.vehicleId);
    console.log(JSON.stringify(this.AssignBillingForm.getRawValue()));

    var rawData = this.AssignBillingForm.getRawValue();

    var data = {
      id : rawData.id, 
      vehicleId : this.vehicleId,
      customerId : rawData.customerId,
      customerDetailId : rawData.billAddress.id,
      workOrderNo : rawData.workOrderNo,
      workOrderDate : this.userService.getTime(rawData.workOrderDate),
      ammendmentDate : this.userService.getTime(rawData.AmmendmentDate),
      billingDescription : rawData.billingDescription,
      subBillingDescription : rawData.subDescription,
      perHourBilling : rawData.perHourBilling,
      normalRate : rawData.NormalRate,
      overTimeRate : rawData.OverTimeRate,
      perMonthBillingRate : rawData.perMonthBillingRate,
      cgst : rawData.cgst,
      sgst : rawData.sgst,
      igst : rawData.igst,
      stateName : rawData.billAddress.stateCode
    }

    this.dataService.sendPostRequest('jmc/api/v1/billing/assign', data).subscribe(data => {
      if (data['status'] == 200) {
        
      }else{
       
      }
    })
  }

  onReset(){
    this.AssignBillingForm.reset();
  }


  getVehicleConditionList() {

    this.dataService.sendGetRequest('jmc/api/v1/vehicle/condition/list').subscribe(data => {
        if (data['status'] == 200) {
           this.vehicleConditionList = data['payLoad']; 
        }else{
          this.vehicleConditionList = [];
        }
      })
    }

  getVehicleStatusList() {

    this.dataService.sendGetRequest('jmc/api/v1/vehicle/status/list').subscribe(data => {
        if (data['status'] == 200) {
           this.vehicleStatusList = data['payLoad']; 
        }else{
          this.vehicleStatusList = [];
        }
      })
    }

    saveVehicleStatus(){
      console.log(this.vehicleConditionForm.getRawValue());

      var statusData = this.vehicleConditionForm.getRawValue();


      if(this.vehicleConditionForm.valid)

      var data = {
        "vehicleCondition" : statusData.vehicleCondition,
        "vehicleStatus" : statusData.vehicleStatus,
        "fromDate" : this.userService.getTime(statusData.fromdate),
        "toDate" : this.userService.getTime(statusData.toDate),
        "projectId" : this.vehicleStatusFlag == 'ASSIGNED_TO_PROJECT' ? statusData.project : undefined,
        "siteId" : this.vehicleStatusFlag == 'ASSIGNED_TO_PROJECT' ? statusData.site : undefined
      }
      
      let params = new HttpParams().set("vehicleId", this.vehicleId.toString());

      this.dataService.sendPostRequest('jmc/api/v1/vehicle/status/save', data, params).subscribe(data => {
        if (data['status'] == 200) {
          this.vehicleStatusModel.hide();
          this.vehicleId = null;
          this.vehicleConditionForm.reset();

          this.getLiveData();
        }else{

        }
      })
    }

    addVehicleStatus(id){
      
      this.vehicleConditionForm.reset();
      this.vehicleId = id;
      this.vehicleStatusModel.show();
      this.editVehicleStatusFlag = false;

      let params = new HttpParams().set("vehicleId", id);
  
      this.dataService.sendGetRequest('jmc/api/v1/vehicle/status/get', params).subscribe(data => {
        if (data['message'] == 'SUCCESS') {
          
          this.editVehicleStatusFlag = true;
          this.getSite(data['payLoad'].projectId, data['payLoad']);

          if(data['payLoad'].vehicleStatus == 'FREE'){
            this.updateVehicleStatus(data['payLoad']);
          }else if(this.siteBoolean && this.editVehicleStatusFlag){
            this.updateVehicleStatus(data['payLoad']);  
          }

        }else{
           
        }
      })
    }
  
    updateVehicleStatus(data){
      console.log(data);
  
      if(data.vehicleStatus == 'ASSIGNED_TO_PROJECT'){
        this.vehicleConditionForm.addControl('project', this.formBuilder.control('', Validators.required))
        this.vehicleConditionForm.addControl('site', this.formBuilder.control('', Validators.required))
        this.vehicleConditionForm.updateValueAndValidity();
        this.vehicleStatusFlag = 'ASSIGNED_TO_PROJECT';
      }else{
        this.vehicleStatusFlag = 'FREE';
        this.vehicleConditionForm.removeControl('project');
        this.vehicleConditionForm.removeControl('site');
        this.vehicleConditionForm.updateValueAndValidity();
      }

      var editData = {
        id: data.id,
        vehicleCondition : data.vehicleCondition,
        vehicleStatus : data.vehicleStatus,
        fromdate : new Date(data.toDate),
        toDate : null,
        project : data.projectId,
        site : data.siteId
      }
  
      this.vehicleConditionForm.patchValue(editData);
      this.vehicleConditionForm.controls['fromdate'].disable();
      this.vehicleConditionForm.updateValueAndValidity();
    }


    vehicleStatusFlag : String = "FREE";
    public projectList: Array<any> = [];
    public siteList: Array<any> = [];
    siteBoolean : boolean = false;
    editVehicleStatusFlag : boolean = false;

    selectStatus(status){
      if(status == 'FREE'){
        if(!confirm("Vehicle Will be removed from project, Do you want to continue")){
          this.vehicleConditionForm.controls.vehicleStatus.setValue('ASSIGNED_TO_PROJECT');
        }else{
          this.vehicleStatusFlag = 'FREE';
          this.vehicleConditionForm.removeControl('project');
          this.vehicleConditionForm.removeControl('site');
          this.vehicleConditionForm.updateValueAndValidity();
        }
      }else{
        this.vehicleConditionForm.addControl('project', this.formBuilder.control('', Validators.required))
        this.vehicleConditionForm.addControl('site', this.formBuilder.control('', Validators.required))
        this.vehicleConditionForm.updateValueAndValidity();
        this.vehicleStatusFlag = 'ASSIGNED_TO_PROJECT';
      }
    }

    getAllProjects(){
      let params = new HttpParams().set("userId", this.userId.toString());
      this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
        if (data['status'] == 200 && data['payLoad'].length > 0) {
          this.projectList = data['payLoad'];
        }
      })
    }

    projectChange(value){
      this.getSite(value);
    }

    getSite(id, editData?){
      let params = new HttpParams().set("projectId", id);
      this.dataService.sendGetRequest('jmc/api/v1/site/get',params).subscribe(data => {
        if (data['status'] == 200) {
          this.siteList = data['payLoad'];
          this.siteBoolean = true;
          if(this.siteBoolean && this.editVehicleStatusFlag){
            this.updateVehicleStatus(editData);  
          }
        }
      })
    }

    vehicleSearchType : String = 'ALL';
    projectSearchId : Number;
    siteSearchId : Number;
    siteSearchList : Array<any> = [];
    vehicleSearchName : String;
    vehicleListCopy : Array<any> = [];
    vehicleStatusSearch: String;

    searchList : Array<any> = [{"type" : "vehicleName", "name" : "Vehicle Name"},
                               {"type" : "projectName", "name" : "Project Name"},
                               {"type" : "siteName", "name" : "Site Name"},
                               {"type" : "vehicleStatus", "name" : "Vehicle Status"},
                               {"type" : "ALL", "name" : "All"}];
                               

    vehicleProjectChange(event){
      console.log(event);
      let params = new HttpParams().set("projectId", event);
      this.dataService.sendGetRequest('jmc/api/v1/site/get',params).subscribe(data => {
        if (data['status'] == 200) {
          this.siteSearchList = data['payLoad'];
        }
      })
    }

    vehicleSearchChange(event){
      this.projectSearchId = null;
      this.vehicleSearchName = null;
      this.siteSearchId = null;
      this.siteSearchList = [];
      this.vehicleStatusSearch = null;
    }

    searchVehicle(){

      if(this.vehicleSearchType == 'vehicleName'){
        this.vehicleData = this.vehicleListCopy;
          if ( this.vehicleSearchName && this.vehicleSearchName != "" && this.vehicleData.length > 0 ) {
              let vehicleD = this.vehicleData.filter(element => {
                return (element.vehicleNo.toLowerCase().indexOf(this.vehicleSearchName.toLocaleLowerCase()) > -1
              );
            });
            this.createPaginationList(vehicleD);
          }
        }else if(this.vehicleSearchType == 'projectName'){
          this.getLiveData(this.projectSearchId);
        }else if(this.vehicleSearchType == 'siteName'){
          this.getLiveData(null, this.siteSearchId);
        }else if(this.vehicleSearchType == 'vehicleStatus'){
          this.getLiveData(null, null ,this.vehicleStatusSearch);
        }else if(this.vehicleSearchType == 'ALL'){
          this.getLiveData();
        }
        //getLiveData
      }

  public sortedVehicleList = [];
  public paginationIndex : Number = 0;

  private createPaginationList(allVehicleList) {
    this.sortedVehicleList = [];
    var i,j,temparray,chunk = 4;
    for (i=0,j=allVehicleList.length; i<j; i+=chunk) {
        temparray = allVehicleList.slice(i,i+chunk);
        this.sortedVehicleList.push(temparray);                
    }
    this.setSelectedPageList(this.sortedVehicleList[0], 0);
  }

  public setSelectedPageList(list, i){
    this.vehicleData = list;
    this.paginationIndex = i;
  }
}

