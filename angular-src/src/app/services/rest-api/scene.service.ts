import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class SceneService {
  authToken: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }

  getListOfScenes(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/scenes', {headers: headers})
      .map(res => res.json());
  }

  getDevicesDetail(sceneId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/scenes/' + sceneId + '/devices', {headers: headers})
      .map(res => res.json());
  }

  addNewScene(scene){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/scenes/', scene, {headers: headers})
      .map(res => res.json());
  }

  updateScene(scene){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/scenes/' + scene._id, scene, {headers: headers})
      .map(res => res.json());
  }

  deleteScene(sceneId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/scenes/' + sceneId, {headers: headers})
      .map(res => res.json());
  }


  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
