import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class BroadcasterService {
  private _eventBusSource = new Subject<BroadcastEvent>()
  _eventBus = this._eventBusSource.asObservable();

  constructor() {

  }

  broadcast(key: any, data?: any) {
    this._eventBusSource.next({key, data});
  }

  on<T>(key: any) {
    return this._eventBus
      .filter(event => event.key === key)
      .map(event => <T>event.data)
  }

}
