import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service'

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle_type.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleTypeComponent implements OnInit {

  alertsDismiss: any = [];
  vehicleTypeEditId : number;
  vehicleTypeList: Array<any> = [];
  public vehicleType;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getVehicleTypeList();
  }


  getVehicleTypeList() {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle-type/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.vehicleTypeList = data['payLoad'];
      }
    })
  }

  save(text) {
    if (this.vehicleType && this.vehicleTypeEditId) {
      this.dataService.sendPutRequest('jmc/api/v1/vehicle-type/update', {"id": this.vehicleTypeEditId, "vehicleType": this.vehicleType }).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getVehicleTypeList();
          this.vehicleTypeEditId = null;
          this.vehicleType = '';
        }else{
          this.add(data['message']);
        }
      })
    }else{
      this.dataService.sendPostRequest('jmc/api/v1/vehicle-type/save', { "vehicleType": this.vehicleType }).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getVehicleTypeList();
          this.vehicleType = '';
        }else{
          this.add(data['message']);
        }
      })
    }
  }

  add(text): void {
    this.alertsDismiss = [];
    this.alertsDismiss.push({
      type: 'warning',
      msg: text,
      timeout: 5000
    });
  }

  edit(vehi){
    if(vehi.vehicleType){
      this.vehicleType = vehi.vehicleType;
      this.vehicleTypeEditId = vehi.id; 
    }
  }

  delete(desig){
    if(desig.id){
      this.dataService.sendGetRequest('jmc/api/v1/vehicle-type/delete?vehicleTypeId=' + desig.id).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getVehicleTypeList();
        }else{
          this.add(data['message']);
        }
      })
    }
  }
}
