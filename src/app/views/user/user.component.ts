import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  submitted = false;
  alertsDismiss: any = [];
  designationList: Array<any> = [];
  projectList: Array<any> = [];
  siteList: Array<any> = [];
  userEditId: Number;
  dropdownSettings = {};
  siteDropDownSetting = {};
  userId : Number;

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    private userDetails: UserService) { 
      var userDetail = this.userDetails.getUserDetails(); 
      this.userId = userDetail['id'];
    }

  ngOnInit(): void {
    this.getDesignationList();
    this.getProjectList();
    this.multiSelectDropDownSetting();
    this.multiSelectDropDownSiteSetting();

    this.userForm = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      designationId: ['', Validators.required],
      siteIdList: [[], Validators.required],
      project: [[], Validators.required]
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

  getDesignationList() {
    this.dataService.sendGetRequest('jmc/api/v1/designation/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.designationList = data['payLoad'];
      }
    })
  }

  getProjectList(){
    let params = new HttpParams().set("userId", this.userId.toString());
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })  
  }

  projectSelect(event, type){
    if(type == 'selectAll'){
      this.userForm.controls.project.setValue(event);
    }

    if(this.userForm.controls.project.value && this.userForm.controls.project.value.length > 0){
      let pArray = this.getIdArray(this.userForm.controls.project.value);
      this.getSiteList(pArray);
    }
  }

  getIdArray(projectArray : Array<any>){
    let pArray = []; 
    projectArray.forEach(element => {
      pArray.push(element.id);
    });
    return pArray;
  }

  getMultiSelectData(array : Array<any>, key, value){
    let mArray = [];
      
    array.forEach(element => {
      var data = {"id" : null};
      data.id = element.id;
      data[key] = element[value];
      mArray.push(data);
    });
    return mArray;
  }

  getSiteList(idList){

    var data = {"projectIdList": idList}

    this.dataService.sendPostRequest('jmc/api/v1/site/get', data).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.siteList = data['payLoad'];
      }
    })  
  }

  submit(){

    if(this.userForm.valid){

      let data = this.userForm.getRawValue();
      var siteIdList = this.getIdArray(data.siteIdList);
      var projectIdList = this.getIdArray(data.project);
      if(siteIdList != null && siteIdList.length > 0){
        if(projectIdList != null && projectIdList.length < 0){
          alert("Please select Project");
          return;
        }
      }
      data['projectIdList'] = projectIdList;
      data['siteIdList'] = siteIdList;

      if(data.id){
        this.dataService.sendPutRequest('jmc/api/v1/user/update', data).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.onReset()
            this.userEditId = null;
          }else{
            this.add(data['message']);
          }
        });
      }else{
        this.dataService.sendPostRequest('jmc/api/v1/user/save', data).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.onReset()
            this.userEditId = null;
          }else{
            this.add(data['message']);
          }
        });
      }
    }
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  userSelectType: String = "emailId";
  selectedValue : String;

  changeType(event){
   if(event && this.selectedValue){
    this.getUser(event, this.selectedValue);
   }
  }


  getUser(type, value) {
    this.dataService.sendGetRequest('jmc/api/v1/user/get?'+ type + '=' + value).subscribe(data => {
      if (data['status'] == 200) {
        var userData = data['payLoad'];
        userData.designationId = data['payLoad'].designation.id;

        userData.project = this.getMultiSelectData(userData.projects, "project", 'project');
        userData['siteIdList'] = this.getMultiSelectData(userData.sites, "siteName", 'siteName');

        this.userEditId = userData.id; 
        delete userData.createdOn;
        delete userData.lastUpdate;
        delete userData.designationModel;
        delete userData.registrationDate;
        delete userData.active;
        delete userData.password;
        delete userData.projectModels;
        delete userData.designation;
        delete userData.sites;
        delete userData.projects;

        this.userForm.setValue(userData);  
      }
    })
  }

  multiSelectDropDownSetting(){
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'project',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  multiSelectDropDownSiteSetting(){
    this.siteDropDownSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'siteName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  
}
