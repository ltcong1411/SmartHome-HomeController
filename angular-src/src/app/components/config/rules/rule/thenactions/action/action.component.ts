import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService} from '../../../../../../services/rest-api/device.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit, OnChanges {
  @Input() action;
  @Input() order;
  @Input() editHidden;
  @Input() listOfDevicesInHouse;
  @Output() deleteActionEvent = new EventEmitter<Object>();
  @Output() addActionEvent = new EventEmitter();
  @Output() addMobileActionEvent = new EventEmitter();
  @Output() updateActionEvent = new EventEmitter();
  @Output() allowToSave = new EventEmitter<Object>();

  constructor(
    private deviceService: DeviceService
  ) { }

  command: String;
  value: any;
  deviceId: String;
  deviceName: String;
  dimmable: Boolean;
  typeOfLight: String;
  isRBG: Boolean;
  color: String;

  ngOnInit() {
    this.value = this.action.value;
    this.command = this.value === 0 ? 'TURN OFF' : 'TURN ON';
    this.deviceId = this.action.deviceId;
    if(!!this.deviceId){
      this.deviceService.getItemDetails(this.deviceId).subscribe(res=>{
        if(!res.success){
          console.log(res.msg)
        } else {
          switch(res._type){
            case 'light':
              // console.log(res.light);
              this.deviceName = res.light.name;
              this.dimmable = res.light.dimmable;
              this.typeOfLight = res.light.typeOfLight;
              if(this.typeOfLight=='RGB'){
                this.color = this.VBColorToHEX(this.value);
              }
              break;
            default:
              console.log(res);
              break;
          }
        }
      })
    } else {
      this.deviceName = 'null';
      let msg = {
        permission: false,
        msg: 'device not selected'
      }
      this.allowToSave.emit(msg);
    }
  }

  ngOnChanges(){
    // console.log('changed');
  }

  clickCommand(value){
    this.command = value ? 'TURN ON' : 'TURN OFF';
    this.value = value&&1||0;
    this.action.value = value;
    this.updateActionEvent.emit();
  }

  selectDevice(device){
    this.deviceName = device.name;
    this.deviceId = device._id;
    this.dimmable = device.dimmable;
    this.typeOfLight = device.typeOfLight;
    this.action.deviceId = device._id;
    // this.updateActionEvent.emit(this.action);
  }

  getValue(value){
    this.value = value;
    this.command = this.value === 0 ? 'TURN OFF' : 'TURN ON';
    this.action.value = value;
    this.updateActionEvent.emit();
  }

  HEXToVBColor(rrggbb) {
    if(rrggbb.length==4){
      let r = rrggbb[1];
      let g = rrggbb[2];
      let b = rrggbb[3];
      rrggbb = '#' + r + r + g + g + b + b;
    }
    return parseInt(rrggbb.replace('#',''), 16);
  }

  VBColorToHEX(value){
    if(!value) return "#000"
    return '#' + value.toString(16)
  }

  getColor(value){
    this.value = this.HEXToVBColor(value);
    this.command = this.value === 0 ? 'TURN OFF' : 'TURN ON';
    this.action.value = this.value;
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
