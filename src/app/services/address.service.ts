import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

    constructor(private httpClient: HttpClient) { }

  getAddress(lat : number, lng : number):Promise<any>{

    return new Promise((resolve, reject)=>{

      let url : string = `${environment.googleBaseUrl}` +"latlng="+lat+","+lng + "&key=" + `${environment.MAP_API_KEY}`;
      this.httpClient.get(url)
      .subscribe((resp)=>{

        if(resp['status'] == "OVER_QUERY_LIMIT"){
          // setTimeout(()=>{
          //   this.getAddress(lat, lng);
          // },500)
        }else{
          resolve(resp)
        }

      })
    })
  }

  getAddressHere(lat : number, lng : number):Promise<any>{

    return new Promise((resolve, reject)=>{

      let url : string = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=`+lat+`%2C`+lng+
      `&mode=retrieveAddresses&maxresults=1&&app_id=iTvlm7GKY9yvXzRGEEFx&app_code=7WlgKoQYoAdJl2U3PurywQ`;
      this.httpClient.get(url)
      .subscribe((resp)=>{

        // resolve(resp)
        // INFO: Below logic to handle OVER_QUERY_LIMIT error
        if(resp['status'] == "OVER_QUERY_LIMIT"){
          // setTimeout(()=>{
          //   this.getAddress(lat, lng);
          // },500)
        }else{
          resolve(resp)
        }

      })
    })
  }

}