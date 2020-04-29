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
  @ViewChild('largeModal') public largeModal: ModalDirective;

  constructor(private dataService: DataService, private userService: UserService, private addressService : AddressService) { }

  ngOnInit(): void {
    this.getLiveData();
  }

  getLiveData(){
    let params = new HttpParams().set("userId", "8");

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/live', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payload'].length > 0) {
         this.vehicleData = data['payload'];
      }else{
         this.vehicleData = [];
      }
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

}
