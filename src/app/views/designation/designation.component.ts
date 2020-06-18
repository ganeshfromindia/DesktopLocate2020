import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent implements OnInit {

  alertsDismiss: any = [];
  designationList: Array<any> = [];
  designationEditId : number;
  public designation;
  public level;

  public levelList = [1,2,3,4,5,6,7,8,9,10];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getDesignationList();
  }

  getDesignationList() {
    this.dataService.sendGetRequest('jmc/api/v1/designation/get/all').subscribe(data => {
      if (data['status'] == 200 && data['payLoad'].length > 0) {
        this.designationList = data['payLoad'];
      }
    })
  }

  save(text) {
    if (this.designation && this.designationEditId) {
      this.dataService
      .sendPutRequest('jmc/api/v1/designation/update', {"id": this.designationEditId, "designation": this.designation , "level" : this.level})
      .subscribe(data => {

        if (data['status'] == 200) {
          this.add(data['message']);
          this.getDesignationList();
          this.designationEditId = null;
          this.designation = '';
          this.level = null;
        }else{
          this.add(data['message']);
          this.designationEditId = null;
          this.designation = '';
          this.level = null;
        }
      })
    }else{
      this.dataService.sendPostRequest('jmc/api/v1/designation/save', { "designation": this.designation, "level" : this.level }).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getDesignationList();
          this.designation = '';
          this.level = null;
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
    if(desig.designation){
      this.designation = desig.designation;
      this.level = desig.level;
      this.designationEditId = desig.id; 
    }
  }

  delete(desig){
    if(desig.id){
      this.dataService.sendGetRequest('jmc/api/v1/designation/delete?designationId=' + desig.id).subscribe(data => {
        if (data['status'] == 200) {
          this.add(data['message']);
          this.getDesignationList();
        }else{
          this.add(data['message']);
        }
      })
    }
  }
}
