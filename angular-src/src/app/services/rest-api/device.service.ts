import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class DeviceService {
  authToken: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }

  getListOfDevices(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/devices', {headers: headers})
      .map(res => res.json());
  }

  updateRoomId(deviceId, roomId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/devices/' + deviceId + '/room-id', roomId, {headers: headers})
      .map(res => res.json());
  }

  updatePermission(deviceId, permission){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/devices/' + deviceId + '/permission', permission, {headers: headers})
      .map(res => res.json());
  }

  updateLights(deviceId, lightingcontrol){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/devices/' + deviceId + '/lights', lightingcontrol, {headers: headers})
      .map(res => res.json());
  }

  updateSensorName(deviceId, sensors){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/devices/' + deviceId + '/sensors', sensors, {headers: headers})
      .map(res => res.json());
  }

  getLightDetails(lightId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/devices/lighting-controls/lights/' + lightId, {headers: headers})
      .map(res => res.json());
  }

  getItemDetails(itemId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/devices/items/' + itemId, {headers: headers})
      .map(res => res.json());
  }

  deleteDevice(deviceId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/devices/' + deviceId, {headers: headers})
      .map(res => res.json());
  }


  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
