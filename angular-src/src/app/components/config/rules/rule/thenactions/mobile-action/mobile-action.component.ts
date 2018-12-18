import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService} from '../../../../../../services/rest-api/device.service';

@Component({
  selector: 'app-mobile-action',
  templateUrl: './mobile-action.component.html',
  styleUrls: ['./mobile-action.component.css']
})
export class MobileActionComponent implements OnInit {
  @Input() action;
  @Input() order;
  @Input() editHidden;
  @Output() deleteActionEvent = new EventEmitter<Object>();
  @Output() addActionEvent = new EventEmitter();
  @Output() addMobileActionEvent = new EventEmitter();
  @Output() updateActionEvent = new EventEmitter();
  @Output() allowToSave = new EventEmitter<Object>();

  constructor(
    private deviceService: DeviceService
  ) { }

  command: String;
  phoneNumber: any;
  message: any;
  deviceId: String;
  deviceName: String;
  dimmable: Boolean;
  typeOfLight: String;
  isRBG: Boolean;
  color: String;

  ngOnInit() {
    this.command = this.action.typeOfMobileAction;
    this.phoneNumber = this.action.phoneNumber;
    this.message = this.action.message;
  }

  ngOnChanges(){
    // console.log('changed');
  }

  pickAction(action){
    switch(action){
      case 'CALL':
        this.command = 'CALL'
        this.action.typeOfMobileAction = 'CALL'
        break;
      case 'SEND SMS':
        this.command = 'SEND SMS'
        this.action.typeOfMobileAction = 'SEND SMS'
        break
    }
    this.updateActionEvent.emit();
  }

  editValuePhoneNumber(event){
    let phoneNumber = event.target.value;
    this.phoneNumber = phoneNumber;
    this.action.phoneNumber = phoneNumber;
    this.updateActionEvent.emit();
  }

  editValueMessage(event){
    this.message = event.target.value;
    this.action.message = this.message; 
    this.updateActionEvent.emit();
    
  }

  deleteAction(){
    let msg = {
      order: this.order,
      action: this.action
    }
    this.deleteActionEvent.emit(msg);
  }

  addAction(){
    this.addActionEvent.emit();
  }

  addMobileAction(){
    this.addMobileActionEvent.emit();
  }
}
