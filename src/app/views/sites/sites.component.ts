import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';

import {MapsAPILoader} from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  siteForm: FormGroup;
  isValidFormSubmitted = null;
  selectedItems = [];
  dropdownSettings = {};

  @ViewChild("searchAddress")
  public searchAddress: ElementRef;

  constructor(private formBuilder: FormBuilder, private dataService: DataService,
             private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.createForm();
    this.getProjectList();
    this.getSiteList();
    this.multiSelectDropDownSetting();
    this.autoCompleteAddress();
  }

  createForm(){
    this.siteForm = this.formBuilder.group({
      id: [null],
      siteName: ['', Validators.required],
      projectIdList: [[], Validators.required],
      address: ['', Validators.required],
      latitude: [{value: '', disabled: true}, Validators.required],
      longitude: [{value: '', disabled: true}, Validators.required],
      telephoneNumber: ['', Validators.required]
    })
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false;
    if (this.siteForm.invalid) {
       return;
    }
    this.isValidFormSubmitted = true;

    let phoneNumberArray : Array<Number> = this.siteForm.controls.telephoneNumber.value.split(',');
    let numberArray: Array<Number> = [] 
    let isNumberValid : boolean = true;
    phoneNumberArray.forEach(element => {
      numberArray.push(element);
      if(!this.validation.isNumber(element)){
        alert("Enter Numeric value in telephone number " + element)
        isNumberValid = false;
        return;
      }    
    });

    if(!isNumberValid){
      return;
    }

    var data = {
                "siteName":this.siteForm.controls.siteName.value,
                "address":this.siteForm.controls.address.value,
                "latitude":this.siteForm.controls.latitude.value,
                "longitude":this.siteForm.controls.longitude.value,
                "telephoneNumber": numberArray
               }
  let params = new HttpParams().set("userId", "8");  
  console.log(this.siteForm.getRawValue());    
  let projectArray = [];
  if(this.siteForm.controls.projectIdList.value && this.siteForm.controls.projectIdList.value.length > 0){
    data['projectId'] = this.siteForm.controls.projectIdList.value[0].id;
  }

  if(this.siteForm.controls.id.value){
    
    data['id'] = this.siteForm.controls.id.value;

    this.dataService.sendPutRequest('jmc/api/v1/site/update', data).subscribe(data => {
      if (data['status'] == 200) {
        this.add(data['message']);
        this.siteForm.reset();
        this.getSiteList();
      }else{
        this.add(data['message']);
      }
    });

  }else{
    
    
    this.dataService.sendPostRequest('jmc/api/v1/site/save', data, params).subscribe(data => {
      if (data['status'] == 200) {
        this.add(data['message']);
        this.siteForm.reset();
        this.getSiteList();
      }else{
        this.add(data['message']);
      }
    });
  }             

             
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

          this.siteForm.controls.address.setValue(location['address']);
          this.siteForm.controls.latitude.setValue(location['latitude']);
          this.siteForm.controls.longitude.setValue(location['longitude']);
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
      address: place.name + ', ' + place.formatted_address,
      city: requiredAddress['city'] !== undefined ? requiredAddress['city'] : '',
      pinCode: requiredAddress['postal_code'] !== undefined ? requiredAddress['postal_code'] : '',
      state: requiredAddress['state'] !== undefined ? requiredAddress['state'] : '',
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    };

    return location;
  }

  validation = {
    isEmailAddress:function(str) {
        var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty:function (str) {
        var pattern =/\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame:function(str1,str2){
        return str1 === str2;
    }
  }; 

  alertsDismiss: any = [];
  add(text): void {
    this.alertsDismiss = [];
    this.alertsDismiss.push({
      type: 'warning',
      msg: text,
      timeout: 5000
    });
  }

  siteList: Array<any> = [];
  projectList: Array<any> = [];
  
  getSiteList() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/site/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.siteList = data['payLoad'];
      }
    })
  }

  getProjectList() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }

  edit(s){

    let phoneNumber = "";
    s.telephoneNumber.forEach((element, index) => {
      if(index == 0){
        phoneNumber = element
      }else {
        phoneNumber = phoneNumber + ',' + element;
      }
    });

    var projectList = [];
    projectList.push({"id" : s.project.id, "project" : s.project.project})

    var data = {
      id: s.id,
      siteName: s.siteName,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      telephoneNumber: phoneNumber,
      projectIdList: projectList
    }

    this.siteForm.patchValue(data);
  }

  multiSelectDropDownSetting(){

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'project',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
}
