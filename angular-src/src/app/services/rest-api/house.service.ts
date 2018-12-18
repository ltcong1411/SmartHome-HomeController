import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class HouseService {
  authToken: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getListOfFloors(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/house/floors', {headers: headers})
      .map(res => res.json());
  }

  addNewFloor(floor){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/house/floors', floor, {headers: headers})
      .map(res => res.json());
  }

  deleteFloor(floorId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/house/floors/' + floorId, {headers: headers})
      .map(res => res.json());
  }

  getListOfRooms(floorId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/house/floors/' + floorId + '/rooms', {headers: headers})
      .map(res => res.json());
  }

  deleteRoom(floorId, roomId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/house/floors/' + floorId + '/rooms/' + roomId, {headers: headers})
      .map(res => res.json());
  }

  addNewRoom(floorId, newRoom){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/house/floors/' + floorId + '/rooms/', newRoom, {headers: headers})
      .map(res => res.json());
  }

  updateImgPath(floorId, roomId, imgPath){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/house/floors/' + floorId + '/rooms/' + roomId + '/imgPath', imgPath, {headers: headers})
      .map(res => res.json());
  }

  getListOfDevicesInRoom(roomId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/house/floors/rooms/' + roomId + '/devices', {headers: headers})
      .map(res => res.json());
  }

  getFloorAndRoomByRoomId(roomId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/house/floors/rooms/' + roomId, {headers: headers})
      .map(res => res.json());
  }

  getListOfDevicesInHouse(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/house/devices', {headers: headers})
      .map(res => res.json());
  }

}
