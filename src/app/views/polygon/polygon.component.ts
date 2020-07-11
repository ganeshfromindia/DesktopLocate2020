import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AddressService } from '../../services/address.service';
import { environment } from '../../../environments/environment';

import {MapsAPILoader} from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.css']
})
export class PolygonComponent implements OnInit {

  polygonForm: FormGroup;
  public projectList: Array<any> = [];

  @ViewChild("searchAddress")
  public searchAddress: ElementRef;
  userId : Number;

  constructor(private dataService: DataService, private userService: UserService,
     private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private addressService : AddressService) {
      var userDetail = this.userService.getUserDetails(); 
      this.userId = userDetail['id'];
      }

  ngOnInit(): void {
  
    this.initRegistrationForm();
    this.getAllProjects();
    this.autoCompleteAddress();
  }

  initRegistrationForm() {

    this.polygonForm = new FormGroup({
      id : new FormControl(null),
      name: new FormControl('', Validators.required),
      projectId: new FormControl(null, Validators.required),
      polygonType: new FormControl('CIRCULAR', Validators.required),
      circularPoint: new FormGroup({
        address: new FormControl(null, Validators.required),
        aerialDistance: new FormControl(200, [Validators.max(20000), Validators.min(200), Validators.required]),
        latitude: new FormControl(null, Validators.required),
        longitude: new FormControl(null, Validators.required)
      })
    });
  } 

  getAllProjects(){
    let params = new HttpParams().set("userId", this.userId.toString());
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }

  autoCompleteAddress() {
    //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
  
        const autocomplete = new google.maps.places.Autocomplete(this.searchAddress.nativeElement, { types: [] });
  
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
          
            const place = autocomplete.getPlace();
            const addressComponent = place.address_components;
            const location: Object = this.createLocationData(place ,addressComponent);
            this.polygonForm.controls['circularPoint'].patchValue(location);

            this.setArialDistance();
          });
        });
      });
    }

    createLocationData(place , addressComponent){

      const requiredAddress: Object = {};
  
      for (let i = 0; i < addressComponent.length; i++) {
        const types: Array<any> = addressComponent[i]['types'];
        if (types.indexOf('postal_code') > -1) {
          requiredAddress['postal_code'] = addressComponent[i]['long_name'];
        } else if (types.indexOf('locality') > -1) {
          requiredAddress['locality'] = addressComponent[i]['long_name'];
        } else if (types.indexOf('sublocality_level_1') > -1) {
          requiredAddress['addressLine2'] = addressComponent[i]['long_name'];
        } else if (types.indexOf('administrative_area_level_2') > -1) {
          requiredAddress['city'] = addressComponent[i]['long_name'];
        } else if (types.indexOf('administrative_area_level_1') > -1) {
          requiredAddress['state'] = addressComponent[i]['long_name'];
        }
      }
  
      const location: Object = {
        address:  place.formatted_address,
        city: requiredAddress['city'] !== undefined ? requiredAddress['city'] : '',
        pinCode: requiredAddress['postal_code'] !== undefined ? requiredAddress['postal_code'] : '',
        state: requiredAddress['state'] !== undefined ? requiredAddress['state'] : '',
        latitude: place.geometry.location_type == "GEOMETRIC_CENTER" ? place.geometry.location.lat : place.geometry.location.lat(),
        longitude: place.geometry.location_type == "GEOMETRIC_CENTER" ? place.geometry.location.lng : place.geometry.location.lng()
      };

      return location;
    }

    onFormSubmit(){
     
      var data = this.polygonForm.getRawValue();
      
      if(data.id){
        this.dataService.sendPutRequest('jmc/api/v1/polygon/update', data).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            
            this.initLatLongBounds('19.000917', '72.8303492');
            this.polygonForm.patchValue({
              'projectId' : data['projectId']
            })
            this.getPolygonDetail(data['projectId']);   
            this.polygonForm.reset();
          }else{
            this.add(data['message']);
          }
        });
      }else{
        this.dataService.sendPostRequest('jmc/api/v1/polygon/save', data).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            
            this.initLatLongBounds('19.000917', '72.8303492');
            this.polygonForm.patchValue({
              'projectId' : data['projectId']
            })
            this.getPolygonDetail(data['projectId']);   
            this.polygonForm.reset();
          }else{
            this.add(data['message']);
          }
        });
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

    
    lat: number = parseFloat('19.000917');
    lng: number = parseFloat('72.8303492');

    circleLat: number = 19.000917;
    circleLng: number = 72.8303492;
    agmCircleRadius: Number;

    public latLongBounds;


    placeMarker($event){
   
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
     
      if(this.polygonForm && this.polygonForm.value && this.polygonForm.value.circularPoint.aerialDistance){
        this.assignCircle(this.polygonForm.value.circularPoint.aerialDistance, this.lat, this.lng);
        this.latLongToAddress(this.lat, this.lng); 
      }
    }

    assignCircle(circleRadius, lat, lng){
      this.agmCircleRadius = Number(circleRadius);
      this.initLatLongBounds(lat, lng);
      this.circleLat = lat;
      this.circleLng = lng;
    }

    latLongToAddress(lat, long){
      this.addressService.getAddress(lat, long).then(data => {
        const location: Object = this.createLocationData(data["results"][0], data["results"][0]['address_components']);
        this.polygonForm.controls['circularPoint'].patchValue(location);
      });     
    }

    private initLatLongBounds(lat, long) {
      const initLatitude: number = parseFloat(lat); //Mumbai latitude
      const initLongitude: number = parseFloat(long);  //Mumbai longitude
      
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(initLatitude, initLongitude));
      this.circleLat = lat;
      this.circleLng = long;

      if(this.circleLat && this.circleLng){
        bounds.extend(new google.maps.LatLng(this.circleLat, this.circleLng));
      }
  
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
        var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
        bounds.extend(extendPoint1);
        bounds.extend(extendPoint2);
     }
      this.latLongBounds = bounds;
    }
  
    mapReady(event) {
      this.initLatLongBounds('19.000917', '72.8303492');
    }

    polygonList : Array<any> = [];

    getPolygonDetail(projectId?) {
      let params = new HttpParams().set("projectId", this.polygonForm.controls['projectId'].value);
      if(projectId){
        params = new HttpParams().set("projectId", projectId);
      }
      
  
      this.dataService.sendPostRequest('jmc/api/v1/polygon/get/list', {}, params).subscribe(data => {
        if (data['status'] == 200) {
          this.createPaginationList(data['payLoad']);
        }else{
          this.polygonList = [];
          this.sortedVehicleList = [];
        }
      }, error => {
        this.polygonList = [];
        this.sortedVehicleList = [];
      })
    }

    edit(p){
      this.polygonForm.patchValue({
        id : p.id,
        name : p.name,
        projectId : p.project.id,
        polygonType : "CIRCULAR",
        circularPoint : {
          address: p.circularPoint.address,
          latitude: p.circularPoint.latitude,
          longitude: p.circularPoint.longitude,
          aerialDistance: p.circularPoint.aerialDistance
        }
      });
      console.log(this.polygonForm.getRawValue());
      this.setArialDistance();
    }

    setArialDistance(){
      if(this.polygonForm && this.polygonForm.value 
        && this.polygonForm.value.circularPoint.aerialDistance && this.polygonForm.value.circularPoint.latitude 
        && this.polygonForm.value.circularPoint.longitude){
          this.assignCircle(this.polygonForm.value.circularPoint.aerialDistance,
           this.polygonForm.value.circularPoint.latitude, this.polygonForm.value.circularPoint.longitude);
      }
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
      this.polygonList = list;
      this.paginationIndex = i;
    }
  
}
