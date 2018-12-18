import { Component, OnInit, Input } from '@angular/core';
import {MessageEventService} from '../../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {
  @Input() sensor;
  message: any;
  value: any;
  constructor(
    private messageEvent: MessageEventService,
  ) { }

  ngOnInit() {
    this.value = this.sensor.value;
    this.messageEvent.emit("socketOn", this.sensor._id);
    this.messageEvent.on(this.sensor._id)
     .subscribe(message => {
       this.value = message;
    });
  }

}
