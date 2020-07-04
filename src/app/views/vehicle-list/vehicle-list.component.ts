import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { AddressService } from '../../services/address.service';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  vehicleData: any = [];
  theCheckbox : boolean = false;
  userId : Number;
  @ViewChild('largeModal') public largeModal: ModalDirective;

  constructor(private dataService: DataService, private userService: UserService, private addressService : AddressService) {
    var userDetail = this.userService.getUserDetails(); 
    this.userId = userDetail['id'];
   }

  ngOnInit(): void {
    this.getLiveData();
  }

  getLiveData(){
    let params = new HttpParams().set("userId", this.userId.toString());

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
         this.createPaginationList(data['payLoad']);
        }else{
         this.vehicleData = [];
         this.sortedVehicleList = [];
      }
    }, error => {
      this.vehicleData = [];
      this.sortedVehicleList = [];
    })
  }

  lat: number = 19.21026;
  lng: number = 72.85801;
  latitude : number;
  longitude : number;
  mapAddress = "";
  mapDataObj : any;

  getAddress(element){

    this.latitude = element.lattitude;
    this.longitude = element.longitude;

    this.lat = element.lattitude;
    this.lng = element.longitude;
    
    if(element.lattitude && element.longitude){
      this.addressService
      .getAddress(element.lattitude, element.longitude)
      .then(data => {
        try {
          this.mapAddress = data["results"][0]["formatted_address"];
          this.largeModal.show();
          this.mapDataObj = {'eventType' : 'live' , data : [element]};
        } catch (error) {
          this.mapAddress = "No Address Found";
        }
      });
    }
  }


  public sortedVehicleList = [];
  public paginationIndex : Number = 0;

  private createPaginationList(allVehicleList) {
    this.sortedVehicleList = [];
    var i,j,temparray,chunk = 2;
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
