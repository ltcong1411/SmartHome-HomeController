import { Component, OnInit } from '@angular/core';
import {MessageEventService} from '../../services/broadcast/message-event.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  alarm: any;
  constructor(
    private messageEvent: MessageEventService
  ) { }

  ngOnInit() {
    // console.log("blahblah")
  }

  showModal(message){
    this.alarm = message;
  }

  turnOffAlert(){
    console.log(this.alarm);
    let message = {
      _id: this.alarm._id,
      value: 0
    }
    this.messageEvent.emit('device-event', message);
  }

}
