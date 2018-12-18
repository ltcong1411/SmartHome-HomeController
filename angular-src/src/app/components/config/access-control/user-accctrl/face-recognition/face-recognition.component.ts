import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccessControlService } from '../../../../../services/rest-api/access-control.service';
import { MessageEventService } from '../../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit {
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
    this.sensorMessage = "Please stand";
    this.sensorMessage2 = "in front of the camera";
  }

  unSubscribe(){
    this.messageHandle.unsubscribe();
    let message = {
      command: 'authenticate'
    }
    this.messageEvent.emit('access-control/face-recognition', message);
  }

  connectSensor(){
    this.sensorMessage = "Please stand";
    this.sensorMessage2 = "in front of the camera";
    this.messageHandle = this.messageEvent.on('access-control/face-recognition/enrol/message').subscribe((message:String)=>{
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
    this.messageEvent.emit('access-control/face-recognition', message);
  }

  deleteAllFingerprint(){
    let message = {
      command: 'deleteFingerprints',
      user: this.user._id
    }
    this.messageEvent.emit('access-control/face-recognition', message);
    this.isFingerprintAvailable.emit(false);
  }


  back(){
    this.backEvent.emit();
  }
}
