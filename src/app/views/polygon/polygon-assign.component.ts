import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { UserService } from '../../user.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AddressService } from '../../services/address.service';

import { MapsAPILoader } from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-polygon-assign',
  templateUrl: './polygon-assign.component.html',
  styleUrls: ['./polygon.component.css']
})
export class PolygonAssignComponent implements OnInit {


  public projectList: Array<any> = [];
  public projectId: Number;
  public polygonId: Number;
  vehicleData: any = [];
  vehicleDataShow: Array<any> = [];

  constructor(private dataService: DataService, private userService: UserService,
    private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private addressService: AddressService) { }


  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }


  polygonList: Array<any> = [];

  getPolygonDetail(projectId?) {
    let params = new HttpParams().set("projectId", projectId);

    this.dataService.sendPostRequest('jmc/api/v1/polygon/get/list', {}, params).subscribe(data => {
      if (data['status'] == 200) {
        this.polygonList = data['payLoad'];
      } else {
        this.polygonList = [];
      }
    })


  }

  vehiclePolyList: boolean = false;
  vehicledataList: boolean = false;

  private assignedPolygon: Array<any> = [];

  getVehiclePolyList(polygonId) {
    let params = new HttpParams().set("polygonId", polygonId);
    this.vehiclePolyList = false;
    this.assignedPolygon = [];

    this.dataService.sendGetRequest('jmc/api/v1/polygon/assign-vehicle', params).subscribe(data => {
      if (data['status'] == 200) {
        this.assignedPolygon = data['payLoad'];
      } else {
        this.assignedPolygon = [];
      }
      this.vehiclePolyList = true;
      if (this.vehicledataList && this.vehiclePolyList) {
        this.mergeVehiclePolygon(this.vehicleData, this.assignedPolygon);
      }
    })

    this.getLiveData(this.projectId);
  }

  getLiveData(projectId?) {

    this.vehicledataList = false;
    this.vehicleDataShow = [];
    let params = new HttpParams({
      fromObject: {
        "userId": "8"
      }
    })

    if (projectId) {
      params = params.append("projectId", projectId);
    }

    this.dataService.sendPostRequest('jmc/api/v1/vehicle/list', {}, params).subscribe(data => {
      if (data['message'] == 'SUCCESS' && data['payLoad'].length > 0) {
        this.vehicleData = data['payLoad'];
      } else {
        this.vehicleData = [];
      }
      this.vehicledataList = true;
      if (this.vehicledataList && this.vehiclePolyList) {
        this.mergeVehiclePolygon(this.vehicleData, this.assignedPolygon);
      }

    });
  }

  mergeVehiclePolygon(vehicle, polygon) {
    vehicle.forEach(v => {
      v['isAssigned'] = false;
      polygon.forEach(p => {
        if (v.id == p.id) {
          v.isAssigned = true;
        }
      });
    });
    this.vehicleDataShow = vehicle;
    console.log(vehicle);
  }

  FieldsChange(event, isAssigned) {

    if(isAssigned){

      if(confirm("Do you want to assign vehicle to polygon!")){
        let assignData = {
          "polygonIdList": [this.polygonId],
          "vehicleIdList": [event.id]
        }
  
        this.dataService.sendPostRequest('jmc/api/v1/polygon/assign', assignData).subscribe(data => {
          if (data['message'] == 'SUCCESS') {
            
          } else {
            
          }
        });
      }else{
        event.isAssigned = false;
      }

    }else{

      if(confirm("Do you want to unassign vehicle from polygon!")){
        let unAssignData = {"vehicleId":event.id,"polygonIdList":[this.polygonId]}

        this.dataService.sendPostRequest('jmc/api/v1/polygon/unassign', unAssignData).subscribe(data => {
          if (data['message'] == 'SUCCESS') {
           
          } else {
           
          }
        });
      }else{
        event.isAssigned = true;
      }
    }
  }

}