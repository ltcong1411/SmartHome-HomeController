import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BroadcasterService} from './broadcaster.service';

@Injectable()
export class MessageEventService {

  constructor(private broadcaster: BroadcasterService) {}

  emit(event, data){
    this.broadcaster.broadcast(event, data);
  }

  on(event) {
    return this.broadcaster.on<Object>(event);
  }


}
