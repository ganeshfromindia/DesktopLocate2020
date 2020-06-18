import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { environment } from '../environments/environment';

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetRequest(url, param?){
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json') 
    };
    if(param){
      httpOptions['params'] = param;
    }

    return this.httpClient.get(environment.base_url + url, httpOptions).pipe(catchError(this.handleError));
  }

  public sendPostRequest(url, body, param?){
    let httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json') 
    };
    if(param){
      httpOptions['params'] = param;
    }
    
    return this.httpClient.post(environment.base_url + url, body, httpOptions).pipe(catchError(this.handleError));
  }

  public sendPostImgRequest(url, body, param?){
    let httpOptions = {
      headers: new HttpHeaders() 
    };
    if(param){
      httpOptions['params'] = param;
    }
    
    return this.httpClient.post(environment.base_url + url, body, httpOptions).pipe(catchError(this.handleError));
  }

  public sendPutRequest(url, body){
    return this.httpClient.put(environment.base_url + url, body).pipe(catchError(this.handleError));
  }

  login(email: string, password: string): Observable<any> {
    if (!email || !password) {
        return of(null);
    }
    const body = {"userName": email ,"password": password}
    return  this.httpClient.post(environment.base_url + 'login', body).pipe(catchError(this.handleError));;

}

forJoinGetSTRPolyLine(urlParamsList:Array<string>): Observable<any>{

  //let newUrl : string = `${environment.snapToRoadUrl}` + urlparams + `${environment.apiKey}`;
  var snapToRoadMultiRequest : Array<Observable<any>> = [];
  urlParamsList.forEach(element => {
    var request = this.httpClient.get(`${environment.snapToRoadUrl}` + element +'&interpolate=true'+ `${environment.apiKey}`)
    snapToRoadMultiRequest.push(request);
  });
  
  return forkJoin(snapToRoadMultiRequest);  
}

}
