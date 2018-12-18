import { Component, OnInit } from '@angular/core';
import { SocketioService } from './services/socketio.service';
import {MessageEventService} from './services/broadcast/message-event.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
                private socketioService:SocketioService,
                private messageEvent: MessageEventService,
             ) {
             }

   private url = 'http://' + window.location.hostname + ':4000';
   private socket

   ngOnInit() {
      this.socket = io(this.url);

      this.socket.on('device-event', (data) => {
        this.messageEvent.emit(data._id, data.value);
      });

      this.messageEvent.on('device-event')
      .subscribe(message=>{
        this.socket.emit("device-event", message);
      })

      this.socket.on('access-control/fingerprint/enrol/message', data=>{
        console.log(data)
        this.messageEvent.emit('access-control/fingerprint/enrol/message', data);
      })

      this.messageEvent.on('access-control/fingerprint')
      .subscribe(message=>{
        this.socket.emit("access-control/fingerprint", message);
      })

      this.socket.on('access-control/face-recognition/enrol/message', data=>{
        console.log(data)
        this.messageEvent.emit('access-control/face-recognition/enrol/message', data);
      })

      this.messageEvent.on('access-control/face-recognition')
      .subscribe(message=>{
        this.socket.emit("access-control/face-recognition", message);
      })

      this.socket.on('security-event', data=>{
        this.messageEvent.emit('security-event', data);
      })
   }
}
