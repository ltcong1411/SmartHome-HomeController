import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired, AuthConfigConsts} from 'angular2-jwt';
import {environment} from '../../../environments/environment';

@Injectable()
export class UserService {
  authToken: any;
  user: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  //QRcode
  registerQRcode(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/users/qrcode', user, {headers: headers})
      .map(res => res.json());
  }

  getListOfQRcodes(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/users/qrcode', {headers: headers})
      .map(res => res.json());
  }

  deleteUser(userId){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/users/qrcode/' + userId, {headers: headers})
      .map(res => res.json());
  }


  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/users/profile', {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    return tokenNotExpired('id_token');
    }

}
