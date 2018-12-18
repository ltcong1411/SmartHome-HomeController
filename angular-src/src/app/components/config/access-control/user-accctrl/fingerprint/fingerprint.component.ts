import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccessControlService } from '../../../../../services/rest-api/access-control.service';
import { MessageEventService } from '../../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent implements OnInit {
  @Output() backEvent = new EventEmitter();
  @Output() isFingerprintAvailable = new EventEmitter<Boolean>();
  @Input() user;

  constructor(
    public accessControlService: AccessControlService,
    public messageEvent: MessageEventService
  ) { }

  sensorMessage: String;
  sensorMessage2: String;
  messageHandle: any;
  ngOnInit() {
    this.sensorMessage = "Place your finger";
    this.sensorMessage2 = "on the sensor";
  }

  unSubscribe(){
    this.messageHandle.unsubscribe();
    let message = {
      command: 'authenticate'
    }
    this.messageEvent.emit('access-control/fingerprint', message);
  }

  connectSensor(){
    this.sensorMessage = "Place your finger";
    this.sensorMessage2 = "on the sensor";
    this.messageHandle = this.messageEvent.on('access-control/fingerprint/enrol/message').subscribe((message:String)=>{
      console.log(message);
      this.sensorMessage2 = '';
      this.sensorMessage = message;
      if(message==="Complete!"){
        this.isFingerprintAvailable.emit(true);
        this.messageHandle.unsubscribe();
      }
    })
    let message = {
      command: 'enrol',
      user: this.user._id
    }
    this.messageEvent.emit('access-control/fingerprint', message);
  }

  deleteAllFingerprint(){
    let message = {
      command: 'deleteFingerprints',
      user: this.user._id
    }
    this.messageEvent.emit('access-control/fingerprint', message);
    this.isFingerprintAvailable.emit(false);
  }


  back(){
    this.backEvent.emit();
  }

}
