import { Component, OnInit, Input  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../../data.service';

import * as PolyLine from 'polyline';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private http: HttpClient, private dataService: DataService) { }

  lat: number = 19.000917;
  lng: number = 72.8303492;
  zoom: number = 15;
  totalDistance : number;
  historyList : Array<any>;
  flag: Flag;

  ngOnInit(): void {
    this.initFlag();
  }

  private _mapDataObj;
  private mainMapEvent;
  public latLongBounds;

  @Input()
  set mapDataObj(mapDataObj: object) {

    console.log(mapDataObj);
    this.removeMarkerProcess();

      if(mapDataObj){
        this._mapDataObj = mapDataObj;
        if(this.mainMapEvent && this._mapDataObj){
          if(this._mapDataObj['eventType'] == 'live'){
            this.getUserLocations(this.mainMapEvent);
          }else if(this._mapDataObj['eventType'] == 'history' && this.mainMapEvent){
            console.log(this._mapDataObj);
            this.makeHistoryByData(this._mapDataObj['data'], this.mainMapEvent);
          }
          
        }
      }
  }


private initFlag() {

    this.flag = {
        viewPlaceLine: false,
        showPolyline: false,
        showHistory: false,
        showIgnitionHistory: false,
        showPolygonReport: false,
        boundChangeCount: 0,
        showAssignPolygon: false,
        showMapCircle: false,
        isVehicleSearch: false
    }
}

  mapReady(event) {
    
    this.initLatLongBounds('19.000917', '72.8303492');
    this.mainMapEvent = event;
    if(this.mainMapEvent && this._mapDataObj){
      if(this._mapDataObj['eventType'] == 'live'){
        this.getUserLocations(this.mainMapEvent);
      }else if(this._mapDataObj['eventType'] == 'history'){
        console.log(this._mapDataObj);
        this.makeHistoryByData(this._mapDataObj['data'], event);
      }
    }
     
  }

  private initLatLongBounds(lat, long) {
    const initLatitude: number = parseFloat(lat); //Mumbai latitude
    const initLongitude: number = parseFloat(long);  //Mumbai longitude
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(new google.maps.LatLng(initLatitude, initLongitude));

    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
      var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
   }
     
   if(this.latLongBounds){
    this.latLongBounds = bounds;
  }

}

  private getUserLocations(event){

    this.calculateDistance(this._mapDataObj.data)
      .then(newData => {
        this._calculateLatLongBounds(newData, event);
      });
  }

  //TODO: CHANGED FROM object[] -> Array<Object> for test
  private calculateDistance(data: object[]): Promise<Array<Object>> {

    return new Promise((resolve, reject) => {

        // data.forEach(user => {
        let promises = [];
        for (let i = 0; i < data.length; i++) {

            let eta = {};
            if (data[i]['polyLine']) {

                let eta = this.calculateEta(data[i]['polyLine'])
                    .then(response => {
                        if (response['distance'] != '')
                            data[i]['distanceValue'] = response['distance'];

                        if (response['duration'] != '')
                            data[i]['duration'] = response['duration'];

                    });

                promises.push(eta);
            }

        }

        Promise.all(promises)
            .then((response) => { resolve(data) })

    });
}


private calculateEta(address) {
  let responseData = {
      distance: '',
      duration: ''
  };
  return new Promise((resolve, reject) => {
      this.http.get(address)
          .subscribe(result => {

              if (result['status'] === 'OK') {
                  var totalDistance = 0;
                  var totalDuration = 0;
                  /** Traversing all routes */
                  for (var i = 0; i < result['routes'].length; i++) {
                      var legs = result['routes'][i].legs;
                      for (var j = 0; j < legs.length; j++) {
                          let distance = legs[j].distance;
                          let duration = legs[j].duration;
                          totalDistance = totalDistance + distance.value;
                          totalDuration = totalDuration + duration.value;
                      }
                  }
                  let distance = Number((totalDistance / 1000).toFixed(0));
                  responseData.distance = distance + " kms";
                  responseData.duration = this.secondsToHms(totalDuration);

                  resolve(responseData);
              } else {
              }

          });

  });
}

private _calculateLatLongBounds(data: any, event?) {

  if(data.length > 1){
      this.removeMarkerProcess();
      var bounds = new google.maps.LatLngBounds();
      for (let user of data) {

          if(user.latitude && user.longitude){
              this.createMainMarker(user, event);
              bounds.extend(new google.maps.LatLng(user.latitude, user.longitude));
          }else{
              this.MarkerArrayMain.push({});
          }
          
      }

      var boundLength = bounds.getNorthEast().lng() - bounds.getSouthWest().lng();

      if(boundLength < 2){
          var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.001, bounds.getNorthEast().lng() + 0.001);
          var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.001, bounds.getNorthEast().lng() - 0.001);
          bounds.extend(extendPoint1);
          bounds.extend(extendPoint2);
      }

      event.fitBounds(bounds);

  }else{
      this.createMainMarker({'lattitude' :data[0]['latitude'],'longitude' : data[0]['longitude'], 'status' : data[0]['status']}, event);
      this.viewSingleMarkerPan(data[0].latitude, data[0].longitude, event);
  }
}


private viewSingleMarkerPan(lat, lng, event?){
        
  if (!lat || !lng) {
      return true;
  }

  var bounds = new google.maps.LatLngBounds();

  bounds.extend(new google.maps.LatLng(lat, lng))

  if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
      var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
  }

  event.fitBounds(bounds);
}

secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  return hDisplay + mDisplay;
}

private MarkerArrayMain: Array<any> = [];

removeMarkerProcess(){
  this.MarkerArrayMain.forEach(element => {
      if(element.position){
          element.setMap(null)
      }
  });

  this.MarkerArrayMain = [];
}

createMainMarker(position, event, iconFlag?) {
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(position.lattitude, position.longitude),
      icon: '../../../../assets/img/Vehicle-Green.png',
      map: event,
      title: position.vehicleNo
  });

  var infowindow = new google.maps.InfoWindow({
      content: position.vehicleNo ? position.vehicleNo : 'Stopped',
      closeOnMapClick: true,
      padding: '0px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      border: false,
      borderRadius: '0px',
      shadow: true,
      fontColor: '#fff',
      fontSize: '15px'
  });

  marker.addListener('click', function() {
      infowindow.close();
      infowindow.open(this.event, marker);
  });

  this.MarkerArrayMain.push(marker);
}


makeHistoryByData(payload, event){
  this.totalDistance = this.calculateDistanceTravelled(payload);
  this.historyList = payload;
  let firstData = this.historyList[0];

  if (firstData && firstData['type'] != 'STATIC') {
    this.removeMarkerProcess();
     this.setPolylines(0);
 } else if (firstData && firstData['type'] == 'STATIC') {
     this.showSingleMarker(firstData['sourceLat'], firstData['sourceLong']);
     if (event) {
      firstData['lattitude'] = firstData['sourceLat'];
      firstData['longitude'] = firstData['sourceLong'];
         this.setMarkerHistory(firstData, event);
     }
 }
}

private calculateDistanceTravelled(data: Array<Object>) {

  let totalDistance = 0;
  for (let i = 0; i < data.length; i++) {
      
      if (data[i]['locationType'] != 'STATIC') {
          totalDistance = totalDistance + Number(data[i]['distanceValue']);
      }
  }
  return totalDistance / 1000.0;
}

public polylines: Array<any>;

private setPolylines(index: number, map?) {
    
      let pl = PolyLine.decode(this.historyList[index]['polyLine']);
      this.optimizePolylineFunction(index, pl);
      //this.setPolylineCustom(pl, map);
}

private showSingleMarker(lat, lng) {

  if (!lat || !lng) {
      return true;
  }

  this.flag.viewPlaceLine = true;
  this.flag.showPolyline = false;

  var bounds = new google.maps.LatLngBounds();

  bounds.extend(new google.maps.LatLng(lat, lng))

  if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
      var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
  }

  if(this.latLongBounds){

  }
  this.latLongBounds = bounds;
  //this.latLongBounds = <LatLngBoundsLiteral>{ west: 77.507347 - 0.01, north: 27.213051 + 0.01, south: 27.213051 - 0.01, east: 77.507347 + 0.01 };    
}

private historyMarkerIndex : number = 0;

    setMarkerHistory(position, event) {

      if(this.historyMarkerIndex < 1){
        this.createMainMarker(position, event, true);
      }else{
        this.updateMarker(this.MarkerArrayMain, [position]);
      }

      this.historyMarkerIndex++  
    }

    updateMarker(marker, positions) {

      for (let index = 0; index < marker.length; index++) {
          const position = positions[index];
          if(marker[index] && marker[index].position){
              const mark = marker[index];

              var latlng = new google.maps.LatLng(positions[index]['latitude'], positions[index]['longitude']);
              mark.setPosition(latlng);

              // this.animatedMove(mark, .5, mark.position, [positions[index]['latitude'], positions[index]['longitude']]);
          }
      }
  }

  optimizePolylineFunction(index: number, pl){

    this._getOptimisedPolyline(pl)
        .then((resp) => {
            if (resp != undefined && resp.hasOwnProperty("snappedPoints") && resp['snappedPoints'].length > 0 && resp['snappedPoints'][0] != undefined) {
                //this.processSnapToRoadResponse(resp);

                this._extractPolylines(resp)
                    .then((filteredPolylines) => {

                        if(filteredPolylines.length > 0){
                            this.polylines = filteredPolylines;
                        }
                    
                        this._calcLatLongBoundsWithoutKey(this.polylines);
                        return;

                    })
                    .then(() => {
                      this.flag.viewPlaceLine = true;
                      this.flag.showPolyline = true;
                  })
                  .catch((genericPolyLines) => {

                        this.polylines = genericPolyLines;
                        this._calcLatLongBoundsWithoutKey(this.polylines);
                        return;
                    })
            }else{
                this.polylines = pl;
                this._calcLatLongBoundsWithoutKey(this.polylines);
            }
        })
        .then(() => {
            // this.flag.viewPlaceLine = true;
            // this.flag.showPolyline = true;
        })
        .catch((error) => {

            this.polylines = pl;
            this._calcLatLongBoundsWithoutKey(this.polylines);
            // this.flag.viewPlaceLine = true;
            // this.flag.showPolyline = true;
        })
}

private _calcLatLongBoundsWithoutKey(data: any) {

  var bounds = new google.maps.LatLngBounds();

  for (let user of data) {
      bounds.extend(new google.maps.LatLng(user[0], user[1]));
  }

  if(this.latLongBounds){
    this.latLongBounds = bounds;
  }
}

_getOptimisedPolyline(list: any[]): Promise<any> {

  return new Promise((resolve, reject) => {
      if (list != undefined && list.length > 0) {
          // INFO: snap-to-road api takes max 100 gps points
          this._checkParameterLimit(list)
              .then((resp) => {

                  let latLngStr: string = "";
                  let gpsPointArray : Array<any> = [];
                  let temp1 = [];
                  let temp2 = [];
                 
                  for (let i = 0; i < resp.length; i++) {

                      latLngStr += resp[i][0] + "," + resp[i][1];
                      
                      if ((i != resp.length - 1 && i % 99 != 0) || i == 0)
                          latLngStr += "|";

                      if(i != 0 && i % 99 == 0){
                         gpsPointArray.push(latLngStr);
                         latLngStr = ""
                      }
                      if((i+1) == resp.length && latLngStr && latLngStr != ""){
                          gpsPointArray.push(latLngStr);
                      }
                      
                  }
                 
                  return gpsPointArray;
              })
              .then((gpsPoints) => {
                

                  // let urlparams = gpsPoints + "&interpolate=true";
                  // this.backEndService.getSTRPolyline(urlparams)
                  //     .then((optimisedPolylines) => {
                  //         console.log("optimisedPolylines :", optimisedPolylines);
                  //         resolve(optimisedPolylines);
                  //     })
                  
                  this.dataService.forJoinGetSTRPolyLine(gpsPoints).subscribe(responseList => {
                    
                      var finalPolylineList = [];
                      responseList.forEach(element => {
                          finalPolylineList = finalPolylineList.concat(element.snappedPoints)
                      });
                     
                      resolve({"snappedPoints" : finalPolylineList});
                  });
                  
              })
              .catch((error) => reject(error))
      } else
          reject("NO_DATA");

  });
}

_extractPolylines(data: Object): Promise<any> {

  return new Promise((resolve, reject) => {

      let newPolyLines: Array<any> = [];
      if (data.hasOwnProperty("snappedPoints") && data['snappedPoints'].length > 0) {

          let snappedPoints: Array<Object> = data['snappedPoints'];
          for (let i = 0; i < snappedPoints.length; i++) {

              let latLngArray: Array<number> = [];
              latLngArray.push(snappedPoints[i]['location']['latitude']);
              latLngArray.push(snappedPoints[i]['location']['longitude']);
              newPolyLines.push(latLngArray);
          }
          resolve(newPolyLines);
      } else
          reject(data);
  })
}

_checkParameterLimit(originalList: Array<any>): Promise<any[]> {

  // INFO: snap-to-road api takes max 100 gps points
  const size = 100;
  return new Promise((resolve, reject) => {
      let tempList: Array<any> = originalList;
      if(!this.grahicModalObj.highGraphicflag){
          while (tempList.length > size) {
              for (let i = 0; i < originalList.length; i++) {
                  if (i % 2 == 0 && tempList.length > size)
                      tempList.splice(i, 1)
              }
          }
      }
      resolve(tempList);
  })
}

grahicModalObj = {
  showGraphicModel : false,
  userMapcomponant : this,
  setPolylineIndex : 0,
  graphicModalClick : function(){
    if(this.showGraphicModel){
        this.showGraphicModel = false;
        // this.highGraphicflag = false;
    }else{
        this.showGraphicModel = true;
        // this.highGraphicflag = true;
    }
  },
  highGraphicflag : false,
  graphicButtonClick : function(highGraphicflag){
      this.userMapcomponant.grahicModalObj.showGraphicModel = false;
      this.userMapcomponant.setPolylines(this.setPolylineIndex);
  }
};


private mapPolyLine(user: any, index: number) {
        
  if(this.MarkerArrayMain.length > 0 && this.MarkerArrayMain[0]){
      this.removeMarkerProcess();
  }
  
  if (user.type != 'STATIC'){
      this.grahicModalObj.setPolylineIndex = index;
      this.setPolylines(index);
  }
  else {
      this.removeMarkerProcess();
      user['lattitude'] = user['sourceLat'];
      user['longitude'] = user['sourceLong'];
      this.createMainMarker(user, this.mainMapEvent, true);
      this.showSingleMarker(user['sourceLat'], user['sourceLong']);
  }
}

}


export interface Flag {

  viewPlaceLine: boolean;
  showPolyline: boolean;
  showHistory: boolean;
  showIgnitionHistory: boolean;
  showPolygonReport: boolean;
  boundChangeCount: number;
  showAssignPolygon: boolean;
  showMapCircle: boolean;
  isVehicleSearch: boolean
}