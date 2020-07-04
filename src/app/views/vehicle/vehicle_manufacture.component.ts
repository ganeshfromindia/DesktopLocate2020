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
      timeout: 9000
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
      console.log(desig);
      this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/delete?manufacturerId=' + desig.id).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getManufactureList();
        }else{
          if(data['payLoad'] && data['payLoad'].length > 0){
            let ePaylad = this.arrayTextCommaSeperated(data['payLoad']);
            this.add(data['message'] +" "+ ePaylad);
          }else {
            this.add(data['message']);
          }
        }
      }, error => {        
        if(error.payLoad && error.payLoad.length > 0){
          let ePaylad = this.arrayTextCommaSeperated(error.payLoad);
          this.add(error['message'] +" "+ ePaylad);
        }else {
          this.add(error['message']);
        }
      })
    }
  }

  public arrayTextCommaSeperated(payload : Array<any>){
    var result = new Array();
    for (var i=0; i< payload.length; i++)
    {
        var selectedcol = payload[i].vehicleNo;
        result.push(selectedcol);
    }
    return result.join(', ');
  }
}
