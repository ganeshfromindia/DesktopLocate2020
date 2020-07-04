import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projectList : Array<any> = [];
  projectName = "";
  editId = null;
  makeModelEditId = false;
  userId : Number;

  constructor(private dataService: DataService,
    private userDetails: UserService) {
      var userDetail = this.userDetails.getUserDetails(); 
      this.userId = userDetail['id']; }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    let params = new HttpParams().set("userId", this.userId.toString());
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.createPaginationList(data['payLoad']);
      }
    })
  }

  save(){

    if(this.projectName){
      
      let data = {"project": this.projectName};
      let params = new HttpParams().set("userId", this.userId.toString());
      
      if(this.editId){
        data['id'] = this.editId;
        this.dataService.sendPutRequest('jmc/api/v1/project/update', data).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.getProjectList();
  
            this.projectName = "";
            this.editId = null;
          }else{
            this.add(data['message']);
            this.projectName = "";
            this.editId = null;
          }
        }, error => {        
          if(error.payLoad && error.payLoad.length > 0){
            let ePaylad = this.arrayTextCommaSeperated(error.payLoad);
            this.add(error['message'] +" "+ ePaylad);
          }else {
            this.add(error['message']);
          }
        });

        this.makeModelEditId = false;

      }else{
        this.dataService.sendPostRequest('jmc/api/v1/project/save', data, params).subscribe(data => {
          if (data['status'] == 200) {
            this.add(data['message']);
            this.getProjectList();
            this.projectName = "";
  
          }else{
            this.add(data['message']);
            this.projectName = "";
          }
        }, error => {        
          if(error.payLoad && error.payLoad.length > 0){
            let ePaylad = this.arrayTextCommaSeperated(error.payLoad);
            this.add(error['message'] +" "+ ePaylad);
          }else {
            this.add(error['message']);
          }
        });
      }
    }
  }


alertsDismiss: any = [];
add(text): void {
  this.alertsDismiss = [];
  this.alertsDismiss.push({
    type: 'warning',
    msg: text,
    timeout: 9000
  });
}

edit(p){

    this.projectName = p.project;
    this.editId = p.id;
    this.makeModelEditId = true;
  }

  public arrayTextCommaSeperated(payload : Array<any>){
    var result = new Array();
    for (var i=0; i< payload.length; i++)
    {
        var selectedcol = payload[i].firstName + " " + payload[i].lastName;
        result.push(selectedcol);
    }
    return result.join(', ');
  }

  reset(){
    this.projectName = null;
    this.editId = null;
    this.makeModelEditId = false;
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
    this.projectList = list;
    this.paginationIndex = i;
  }

}
