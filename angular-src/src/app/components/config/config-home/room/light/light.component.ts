import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {MessageEventService} from '../../../../../services/broadcast/message-event.service';
import {BroadcasterService} from '../../../../../services/broadcast/broadcaster.service';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit, OnDestroy {
  @Input() light;

  messageEvent: any;
  lightValue: Number;
  preLightValue: Number;
  switchValue: Number;
  color: any;

  constructor(
    private messageSerivce: MessageEventService,
    private broadcaster: BroadcasterService
  ) {}

  ngOnInit() {
    this.lightValue = this.switchValue = this.light.value;
    this.color = this.VBColorToHEX(this.lightValue);
    console.log(this.color);
    this.messageEvent = this.messageSerivce.on(this.light._id)
     .subscribe((message:any) => {
       this.lightValue = message;
      //   this.preLightValue = this.switchValue = this.lightValue; nguyen ban
       this.switchValue = this.lightValue;
       this.color = this.VBColorToHEX(this.lightValue);
       console.log(message);
    });
  }

  ngOnDestroy(){
    this.messageEvent.unsubscribe();
  }


  sendMessage(value){
    let message = {
        _id: this.light._id,
        value: value
    }
    this.messageSerivce.emit("device-event", message);
  }

  getSwitchValue(value){
    if(this.light.typeOfLight=="RGB"){
      if(value){
        if(!this.preLightValue){
          this.preLightValue = 16777215;
        }
        this.lightValue = this.preLightValue;
        this.color = this.VBColorToHEX(this.lightValue);
        this.sendMessage(this.lightValue);
      } else {
        this.lightValue = 0;
        this.color = "#000";
        this.sendMessage(this.lightValue);
      }
    } else {
      this.sendMessage(value&1);
    }
  }

  getSliderValue(value){
    this.preLightValue = this.switchValue = value;
    this.sendMessage(value);
  }

  getSwitchValue_Dimmer(value){
    if(!value){
      this.lightValue = 0;
    } else {
      if(this.preLightValue == 0){
        this.lightValue = 50;
      } else {
        this.lightValue = this.preLightValue;
      }
    }
    this.sendMessage(this.lightValue);
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
    this.lightValue = this.preLightValue = this.HEXToVBColor(value);
    this.sendMessage(this.lightValue);
  }

}
