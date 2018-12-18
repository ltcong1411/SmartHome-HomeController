import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class AccessControlService {

  authToken: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getListOfUsers(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/access-control/users', {headers: headers})
      .map(res => res.json());
  }

  addNewUser(newUser){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/access-control/users', newUser, {headers: headers})
      .map(res => res.json());
  }

  deleteUser(userId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/access-control/users/' + userId, {headers: headers})
      .map(res => res.json());
  }

  getUserName(userId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/access-control/users/' + userId + '/name', {headers: headers})
      .map(res => res.json());
  }

  updateImgPath(userId, imgPath){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/access-control/users/' + userId + '/img-path', imgPath, {headers: headers})
      .map(res => res.json());
  }
}
