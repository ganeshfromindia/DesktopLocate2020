import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service'
@Component({
  selector: 'app-vehicle-manufacture',
  templateUrl: './vehicle_manufacture.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleManufactureComponent implements OnInit {

  alertsDismiss: any = [];
  manufactureList: Array<any> = [];
  manufactureEditId : number;
  public manufacture;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getManufactureList();
  }

  getManufactureList() {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.manufactureList = data['payLoad'];
      }
    })
  }

  save(text) {
    if (this.manufacture && this.manufactureEditId) {
      this.dataService.sendPutRequest('jmc/api/v1/vehicle/manufacturer/update', {"id": this.manufactureEditId, "manufacturer": this.manufacture }).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getManufactureList();
          this.manufactureEditId = null;
          this.manufacture = '';
        }else{
          this.add(data['message']);
        }
      })
    }else{
      this.dataService.sendPostRequest('jmc/api/v1/vehicle/manufacturer/save', { "manufacturer": this.manufacture }).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getManufactureList();
          this.manufacture = '';
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

  edit(desig){
    if(desig.manufacturer){
      this.manufacture = desig.manufacturer;
      this.manufactureEditId = desig.id; 
    }
  }

  delete(desig){
    if(desig.id){
      this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/delete?manufacturerId=' + desig.id).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getManufactureList();
        }else{
          this.add(data['message']);
        }
      })
    }
  }
}
