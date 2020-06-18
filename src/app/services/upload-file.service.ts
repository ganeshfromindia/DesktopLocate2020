import { Injectable } from '@angular/core';
import {DataService} from '../data.service'
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
 
  constructor(private dataService:DataService) { }
 
  uploadfile(file, vehileId, imageType, editId?) {
    let formData = new FormData();
    formData.append('file', file, file.name);
    // let params: HttpParams = new HttpParams();
    // params.set("vehicleId", vehileId);
    // params.set("enumType", imageType);

    // if(editId){
    //   params.set("id", editId);
    // }

    const obj = {
      vehicleId : vehileId,
      enumType: imageType
    };

    if(editId){
      obj["id"] = editId;
    }

    const params = new HttpParams({
      fromObject: {
        ...convertAnyToHttp(obj)
      }
    });
    //let params = new HttpParams().set("vehicleId", vehileId).set("enumType", imageType).set("id", editId);
    
    console.log(params);
    this.dataService.sendPostImgRequest('jmc/api/v1/upload', formData, params).subscribe(data => {
       
    })
  }
}


export function convertAnyToHttp(params: {}): { [param: string]: string | string[]; }{
  params = Object.assign({}, params);
  Object.keys(params).forEach(key => {
    if(typeof params[key] === 'object'){
      params[key] = JSON.stringify(params[key]);
    } else if(!params[key]) {
      delete params[key];
    }
  });
  return params;
}