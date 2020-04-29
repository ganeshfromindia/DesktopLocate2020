import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service'

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
  userEditId: Number;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.getDesignationList();
    this.getProjectList();
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      designationId: ['', Validators.required],
      project: ['', Validators.required]
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
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })  
  }

  submit(){

    if(this.userForm.valid){
      this.dataService.sendPostRequest('jmc/api/v1/user/save', this.userForm.getRawValue()).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.onReset()
        }else{
          this.add(data['message']);
        }
      })
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
        userData.designationId = data['payLoad'].designationModel.id;
        userData.project = data['payLoad']['projectModels'] ? data['payLoad']['projectModels'][0].id : null;

        this.userEditId = userData.id; 
        delete userData.createdOn;
        delete userData.lastUpdate;
        delete userData.id;
        delete userData.designationModel;
        delete userData.registrationDate;
        delete userData.active;
        delete userData.password;
        delete userData.projectModels;


        this.userForm.setValue(userData);  
      }
    })
  }
}
