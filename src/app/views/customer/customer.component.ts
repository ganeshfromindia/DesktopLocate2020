import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment';

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
  customerSearch : String = "";
  customerDataCopy : Array<any> = [];
  userId : Number;

  constructor(private dataService: DataService,
    private userDetails: UserService) {
      
     }

  ngOnInit(): void {
    var userDetail = this.userDetails.getUserDetails(); 
    this.userId = userDetail['id'];
    console.log(this.userId);
    this.getCustomerList();
  }

  getCustomerList() {    
    let params = new HttpParams().set("userId", this.userId.toString());
    
    this.dataService.sendGetRequest('jmc/api/v1/customer/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.createPaginationList(data['payLoad']);
        this.customerDataCopy = JSON.parse(JSON.stringify(data['payLoad']));
      }else{
        this.customerDataCopy = [];
        this.sortedVehicleList = [];
      }
    }, error =>{
      this.customerDataCopy = [];
      this.sortedVehicleList = [];
      this.paginationIndex = 0;
    })
  }


  save(){

    if(this.customerName){
      
      let data = {"name": this.customerName};
      let params = new HttpParams().set("userId", this.userId.toString());
      
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

  search(){
    this.customerList = JSON.parse(JSON.stringify(this.customerDataCopy));

    if ( this.customerSearch && this.customerSearch != "" && this.customerList.length > 0 ) {
       let customerListD = this.customerList.filter(element => {
        return (element.name.toLowerCase().indexOf(this.customerSearch.toLocaleLowerCase()) > -1);
    });

    this.createPaginationList(customerListD);
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


  public sortedVehicleList = [];
  public paginationIndex : Number = 0;

  private createPaginationList(allVehicleList) {
    this.sortedVehicleList = [];
    var i,j,temparray,chunk = environment.pageCount;
    for (i=0,j=allVehicleList.length; i<j; i+=chunk) {
        temparray = allVehicleList.slice(i,i+chunk);
        this.sortedVehicleList.push(temparray);                
    }
    this.setSelectedPageList(this.sortedVehicleList[0], 0);
  }

  public setSelectedPageList(list, i){
    this.customerList = list;
    this.paginationIndex = i;
  }
}
