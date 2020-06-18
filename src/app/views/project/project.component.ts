import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    let params = new HttpParams().set("userId", "8");
    this.dataService.sendGetRequest('jmc/api/v1/project/get/all', params).subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.projectList = data['payLoad'];
      }
    })
  }

  save(){

    if(this.projectName){
      
      let data = {"project": this.projectName};
      let params = new HttpParams().set("userId", "8");
      
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
    timeout: 5000
  });
}

edit(p){

    this.projectName = p.project;
    this.editId = p.id;
    this.makeModelEditId = true
  }

}
