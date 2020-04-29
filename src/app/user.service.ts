import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private members:any = [];

  selectedMember: Object;

  constructor() { }

  // -------------------------- TODO: Move below code to other service ----------------------------------
  public setMembers(userData:object[]){
    this.members = userData
    //INFO: use below if data need not be refreshed
    sessionStorage.setItem('members',JSON.stringify(userData));
  }

  public getMembers(){
    return JSON.parse(sessionStorage.getItem('members'));
  }

  public clearUsers(){
    sessionStorage.removeItem('members');
  }

  //--------------------------------- END ----------------------------------------------

  getUserDetails(){

    return sessionStorage.getItem('userDetails');
  }

  setUserDetails(userDetails){
    sessionStorage.setItem('userDetails',JSON.stringify(userDetails));
    this.setAuthToken(userDetails['authToken']);
  }

  getAuthToken(){

    return JSON.parse(sessionStorage.getItem('authToken'));
  }

  setAuthToken(token : any){
    sessionStorage.setItem('authToken',JSON.stringify(token));
  }

  setOmanniAuthToken(token : any){
    sessionStorage.setItem('oamnniToken',JSON.stringify(token));
  }

  getOmmaniAuthToken(){
    return JSON.parse(sessionStorage.getItem('oamnniToken'));
  }

  clearUser(){

    sessionStorage.removeItem('userDetails');
    this.clearToken();
  }

  clearToken(){

    sessionStorage.removeItem('authToken');
  }

  clearDetails(){
    this.clearToken();
    this.clearUser();
  }

  logout(){

      this.clearToken();
      this.clearUser();
  }

  
  public setRoleBasedMenu(menu:object[]){
    sessionStorage.setItem('menu',JSON.stringify(menu));
  }

  public getRoleMenu(){
    return JSON.parse(sessionStorage.getItem('menu'));
  }

  public setVehicleList(list:object[]){
    sessionStorage.setItem('vehicleList',JSON.stringify(list));
  }

  public getVehicleList(){
    return JSON.parse(sessionStorage.getItem('vehicleList'));
  }

  getCurrentStartTime(){
    
    let currentTime = new Date().setHours(0);
    currentTime = new Date(currentTime).setMinutes(0);
    currentTime = new Date(currentTime).setSeconds(0);
    currentTime = new Date(currentTime).setMilliseconds(0);
    currentTime = new Date(currentTime).getTime();

    return currentTime;
  }

  getCurrentEndTime(){
    
    let currentTime = new Date().setHours(23);
    currentTime = new Date(currentTime).setMinutes(59);
    currentTime = new Date(currentTime).setSeconds(59);
    currentTime = new Date(currentTime).setMilliseconds(999);
    currentTime = new Date(currentTime).getTime();

    return currentTime;
  }
  
  getStartTime(date){
    
    let startTime = new Date(date).setHours(0);
    startTime = new Date(startTime).setMinutes(0);
    startTime = new Date(startTime).setSeconds(0);
    startTime = new Date(startTime).setMilliseconds(0);
    startTime = new Date(startTime).getTime();

    return startTime;
  }
  
  getTime(date){
   return new Date(date).getTime();
  }

  getEndTime(date){
    
    let endTime = new Date(date).setHours(23);
    endTime = new Date(endTime).setMinutes(59);
    endTime = new Date(endTime).setSeconds(59);
    endTime = new Date(endTime).setMilliseconds(999);
    endTime = new Date(endTime).getTime();

    return endTime;
  }

  getFormattedTime(timeInMilli){
    
    let newTime = new Date(timeInMilli)
    let hours = newTime.getHours();
    let minutes = newTime.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? Number('0'+minutes) : minutes;
    let calcTime = hours + ':' + minutes + ' ' + ampm;
    return calcTime;
  }
}

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform
{
    transform(value:any, args:string[]): any {
        let keys:any[] = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}
