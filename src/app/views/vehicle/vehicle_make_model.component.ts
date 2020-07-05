import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service'
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vehicle-make-model',
  templateUrl: './vehicle_make_model.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleMakeModelComponent implements OnInit {

  alertsDismiss: any = [];
  makeModelList: Array<any> = [];
  manufactureList: Array<any> = [];
  makeModelEditId : number;
  manufactureId : number;
  public makeModel;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getManufactureList();
  }

  getManufactureList() {
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.manufactureList = data['payLoad'];
        this.manufactureId = this.manufactureList[0].id
        this.getMakeModelFromManufacture(this.manufactureId);
      }else{
        this.manufactureList = [];
      }
    })
  }

  changeManufacture(event){
    this.getMakeModelFromManufacture(event);
  }

  getMakeModelFromManufacture(manufacture){
    this.dataService.sendGetRequest('jmc/api/v1/vehicle/manufacturer/get/make-model?manufacturerId='+ manufacture).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.createPaginationList(data['payLoad']);
      }else{
        this.makeModelList = [];
      }
    })
  }

  save(text) {
    if (this.makeModel && this.makeModelEditId) {
      this.dataService
      .sendPutRequest('jmc/api/v1/vehicle/make-model/update', {"manufacturerId": this.manufactureId, "id": this.makeModelEditId, "makeModel": this.makeModel })
      .subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getMakeModelFromManufacture(this.manufactureId);
          this.makeModelEditId = null;
          this.makeModel = '';
        }else{
          this.add(data['message']);
        }
      })
    }else{
      this.dataService.sendPostRequest('jmc/api/v1/vehicle/make-model/save', {"manufacturerId":this.manufactureId,"makeModel":this.makeModel}).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getMakeModelFromManufacture(this.manufactureId);
          this.makeModel = '';
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

  edit(make){
    if(make.makeModel){
      this.makeModel = make.makeModel;
      this.makeModelEditId = make.id; 
    }
  }

  delete(make){
    if(make.id){
      this.dataService.sendGetRequest('jmc/api/v1/vehicle/make-model/delete?makeModelId=' + make.id).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getMakeModelFromManufacture(this.manufactureId);
        }else{
          this.add(data['message']);
        }
      })
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
    this.makeModelList = list;
    this.paginationIndex = i;
  }
}
