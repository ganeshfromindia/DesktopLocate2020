import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customerDetailForm: FormGroup;
  customerDetailList : Array<any> = [];
  customerList : Array<any> = [];

  constructor(private formBuilder: FormBuilder,private dataService: DataService) { }

  ngOnInit(): void {
    this.createForm();
    this.getCustomerList();
  }

  stateList : Array<any> = [{"code" : "MH", "name" : "MAHARASHTRA"},
                            {"code" : "GU", "name" : "GUJRAT"},
                            {"code" : "KE", "name" : "KERALA"}]

  createForm(){
    this.customerDetailForm = this.formBuilder.group({
      id: [null],
      customerId: ['', Validators.required],
      billAddress: ['', Validators.required],
      pinCode: ['', Validators.required],
      state : ['', Validators.required],
      siteAddress: ['', Validators.required],
      gstnNumber: ['', Validators.required],
      gstCode: ['', Validators.required],
      field1: [''],
      field2: [''],
      field3: ['']
    })
  }

  getCustomerList() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/customer/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.customerList = data['payLoad'];
      }
    })
  }


  onFormSubmit(){
    var rawData = this.customerDetailForm.getRawValue();

    var data = {
      "customer_id" : rawData.customerId,
      "billingAddress" : rawData.billAddress,
      "siteAddress" : rawData.siteAddress,
      "gstnNumber" : rawData.gstnNumber,
      "gstCode" : rawData.gstCode,
      "pinCode" : rawData.pinCode,
      "stateCode" : rawData.state,
      "extraField1" : rawData.field1 ? rawData.field1 : undefined,
      "extraField2" : rawData.field2 ? rawData.field2 : undefined,
      "extraField3" : rawData.field3 ? rawData.field3 : undefined,
      "id": rawData.id ? rawData.id : undefined
    }
    
    this.dataService.sendPostRequest('jmc/api/v1/customer/detail/save', data).subscribe(data => {
      if (data['status'] == 200) {
        this.add(data['message']);
        this.customerDetailForm.reset();
      }else{
        this.add(data['message']);
      }
    })
  }

  getCustomerDetail(custmerId) {

    let params = new HttpParams().set("customerId", this.customerDetailForm.controls['customerId'].value);

    this.dataService.sendGetRequest('jmc/api/v1/customer/detail/get', params).subscribe(data => {
      if (data['status'] == 200) {
        this.customerDetailList = data['payLoad'];
      }else{
        this.customerDetailList = [];
      }
    })
  }


  edit(custmerDetail){

    var data = {
    id: custmerDetail.id,
    billAddress: custmerDetail.billingAddress,
    siteAddress: custmerDetail.siteAddress,
    gstnNumber: custmerDetail.gstnNumber,
    pinCode : custmerDetail.pinCode,
    state : custmerDetail.stateCode,
    gstCode: custmerDetail.gstCode,
    field1: custmerDetail.extraField1,
    field2: custmerDetail.extraField2,
    field3: custmerDetail.extraField3
    } 

    this.customerDetailForm.patchValue(data);
  }

  alertsDismiss: any = [];
  add(text): void {
    this.alertsDismiss = [];
    this.alertsDismiss.push({
      type: 'warning',
      msg: text,
      timeout: 5000
    });
  }

}
