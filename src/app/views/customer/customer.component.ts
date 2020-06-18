import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerList : Array<any> = [];
  customerName = "";
  editId = null;
  makeModelEditId = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getCustomerList();
  }

  getCustomerList() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/customer/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.customerList = data['payLoad'];
      }
    })
  }


  save(){

    if(this.customerName){
      
      let data = {"name": this.customerName};
      let params = new HttpParams().set("userId", "8");
      
      if(this.editId){
        data['id'] = this.editId;
        this.dataService.sendPostRequest('jmc/api/v1/customer/save', data, params).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.getCustomerList();
  
            this.customerName = "";
            this.editId = null;
          }else{
            this.add(data['message']);
            this.customerName = "";
            this.editId = null;
          }
        });

        this.makeModelEditId = false;

      }else{
        this.dataService.sendPostRequest('jmc/api/v1/customer/save', data, params).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.getCustomerList();
            this.customerName = "";
  
          }else{
            this.add(data['message']);
            this.customerName = "";
          }
        });
      }
    }
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

edit(p){

  this.customerName = p.name;
  this.editId = p.id;
  this.makeModelEditId = true
  }
}
