import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class RuleService {
  authToken: any;
  baseURL = environment.baseURL;

  constructor(private http:Http) { }
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  getListOfRules(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.baseURL + '/rules', {headers: headers})
      .map(res => res.json());
  }

  updateRule(rule){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.baseURL + '/rules/'+ rule._id, rule, {headers: headers})
      .map(res => res.json());
  }

  deleteRule(ruleId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.baseURL + '/rules/'+ ruleId, {headers: headers})
      .map(res => res.json());
  }

  addNewRule(newRule){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.baseURL + '/rules/', newRule, {headers: headers})
      .map(res => res.json());
  }
}
