import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService} from '../../../../../../services/rest-api/device.service';
import { HouseService} from '../../../../../../services/rest-api/house.service';
import { RuleService } from '../../../../../../services/rest-api/rule.service';
import { AccessControlService } from '../../../../../../services/rest-api/access-control.service';
import { MessageEventService } from '../../../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-relational-operation',
  templateUrl: './relational-operation.component.html',
  styleUrls: ['./relational-operation.component.css']
})
export class RelationalOperationComponent implements OnInit, OnChanges {
  @Input() ruleId
  @Input() operation;
  @Input() addOperationHidden;
  @Input() listOfDevicesInHouse;
  @Input() listOfUsers;
  @Input() editHidden;
  @Output() updateOperationEvent = new EventEmitter<Object>();
  @Output() deleteOperationEvent = new EventEmitter<Object>();
  @Output() addOperationEvent = new EventEmitter();

  constructor(
    private deviceService: DeviceService,
    private houseService: HouseService,
    private ruleService: RuleService,
    private accessControlService: AccessControlService,
    private messageEvent: MessageEventService
  ) { }

  typeOfLight: String;
  _name: String;
  deviceType: String;
  operator: String;
  value: any;
  sliderHidden = true;
  dimmable = true;
  fullOperatorArr = ['Equal to', 'Not Equal to', 'Less than', 'Greater than', 'Less than and Equal to', 'Greater than and Equal to'];
  fullOperatorSymbolArr = ['==', '!=', '<', '>', '<=', '>='];
  operatorArr = this.fullOperatorArr;
  operatorSymbolArr = this.fullOperatorSymbolArr;
  sliderMinValue = 0;
  sliderMaxValue = 100;

  isUserPicked: Boolean;

  ngOnInit() {
    this.addOperationHidden = this.addOperationHidden&&true;
    this.isUserPicked = this.operation.isUser;
    if(!this.isUserPicked){
      //device picked
      let deviceId = this.operation.deviceId;
      this.operator = this.mapOperator(this.operation.operator);
      this.value = this.operation.value;
      if(!!deviceId){
        this.deviceService.getItemDetails(deviceId).subscribe(res=>{
          if(!res.success) return console.log(res.msg);
          switch(res._type){
            case 'light':
              this._name = res.light.name;
              this.dimmable = res.light.dimmable;
              if(!this.dimmable){
                this.operatorArr = ['Equal to'];
                this.operatorSymbolArr = ['=='];
                this.value = this.value ? 'ON' : 'OFF';
              }
              break;
            case 'sensor':
              this._name = res.sensor.name;
              if((res.sensor._type)=='Door'||(res.sensor._type)=='Window'){
                this.deviceType = 'Door';
                this.dimmable = false;
                this.operatorArr = ['Equal to'];
                this.operatorSymbolArr = ['=='];
                this.value = this.operation.value? 'Open' : 'Closed'
              } else if((res.sensor._type)=='Emergency'){
                this.dimmable = false;
                this.deviceType = 'Emergency';
                this.operatorArr = ['Equal to'];
                this.operatorSymbolArr = ['=='];
                this.value = this.operation.value? 'ON' : 'OFF'
              } else {
                this.dimmable = true;
              }
              break;
          }
        })
      } else {
        this._name = 'device';
      }
    } else {
      //user picked
      let userId = this.operation.userId;
      this.accessControlService.getUserName(userId).subscribe(res=>{
        if(!res.success) console.log(res.msg)
        else this._name = res.userName;
      })
    }
  }

  ngOnChanges(){
    if(!this.isUserPicked){
      //device picked
      this.operator = this.mapOperator(this.operation.operator);
      this.value = this.operation.value;
      if(this.deviceType=="Door"){
        this.value = this.value ? 'Open' : 'Closed';
      }else if(!this.dimmable){
        this.value = this.value ? 'ON' : 'OFF';
      }
    }
  }

  mapOperator(operator){
    switch(operator){
      case '==':
        return 'Equal to';
      case '!=':
        return 'Not equal to';
      case '<':
        return 'Less than';
      case '>':
        return 'Greater than';
      case '<=':
        return 'Less than or Equal to';
      case '>=':
        return 'Greater than or Equal to';
      case 'operator':
        return 'operator';
    }
  }

  deleteOperation(){
    this._name = 'device';
    let msg = {
      operationId: this.operation._id
    }
    this.deleteOperationEvent.emit(msg);
  }

  addOperation(){
    this.addOperationEvent.emit('add RelationalOperation');
  }

  selectUser(user){
    this._name = user.name;
    this.isUserPicked = true;
    //update operation
    this.operation = {
      _type: 'RelationalOperation',
      userId: user._id,
      isUser: true
    }
    this.updateOperationEvent.emit(this.operation);
  }

  selectLight(light){
    this.typeOfLight = light.typeOfLight;
    this.isUserPicked = false;
    this._name = light.name;
    this.dimmable = light.dimmable;
    if(!this.dimmable){
      this.operator = 'Equal to';
      this.operatorArr = ['Equal to'];
      this.operatorSymbolArr = ['=='];
      this.value = this.value ? 'ON' : 'OFF';
      this.operation.operator = '==';
      this.operation.value = this.value ? 1 : 0;
    } else {
      this.sliderHidden = false;
      this.value = 0;
      this.operatorArr = this.fullOperatorArr;
      this.operatorSymbolArr = this.fullOperatorSymbolArr;
    }
    this.sliderMaxValue = 100;
    this.operation.isUser = false;
    this.operation.deviceId = light._id;
    this.updateOperationEvent.emit(this.operation);
    this.messageEvent.emit('rule/' + this.ruleId + '/select-device',light);
  }

  selectSensor(sensor){
    this.isUserPicked = false;
    this._name = sensor.name;
    if((sensor._type)=='Door'||(sensor._type)=='Window'){
      this.deviceType = "Door";
      this.dimmable = false;
      this.operatorArr = ['Equal to'];
      this.operatorSymbolArr = ['=='];
      this.value = 'Open';
      this.operation.value = 1;
    } else if((sensor._type)=='Emergency'){
      this.deviceType = "Emergency";
      this.dimmable = false;
      this.operatorArr = ['Equal to'];
      this.operatorSymbolArr = ['=='];
      this.value = 'ON';
      this.operation.value = 1;
    } else {
      this.dimmable = true;
      this.operatorArr = this.fullOperatorArr;
      this.operatorSymbolArr = this.fullOperatorSymbolArr;
      this.sliderMaxValue = (sensor._type==='Light')||(sensor._type==='Gas') ? 1000 : 100;
      this.sliderHidden = false;
      this.value = 0;
      this.operation.value = 0;
    }
    this.operator = 'Equal to';
    this.operation.isUser = false;
    this.operation.deviceId = sensor._id;
    this.operation.operator = '==';
    this.updateOperationEvent.emit(this.operation);
  }

  selectOperator(operator){
    this.operator = this.mapOperator(operator);
    //update operation
    this.operation.operator = operator;
    this.updateOperationEvent.emit(this.operation);
  }

  getValue(value){
    this.value = value;
    //update operation
    this.operation.value = value;
    this.updateOperationEvent.emit(this.operation);
  }

  clickValueBtn(){
    if(this.deviceType=="Door"){
      let check = this.value=='Open';
      this.value = check ? 'Closed' : 'Open';
      this.operation.value = check ? 0 : 1;
      this.updateOperationEvent.emit(this.operation);
    }else if(!this.dimmable){
      let check = this.value=='ON';
      this.value = check ? 'OFF' : 'ON';
      this.operation.value = check ? 0 : 1;
      this.updateOperationEvent.emit(this.operation);
    }
  }
}
