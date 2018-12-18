import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceService} from '../../../../../services/rest-api/device.service';
import { HouseService} from '../../../../../services/rest-api/house.service';
import {MessageEventService} from '../../../../../services/broadcast/message-event.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-room-scene',
  templateUrl: './room-scene.component.html',
  styleUrls: ['./room-scene.component.css']
})
export class RoomSceneComponent implements OnInit {
  @Input() sceneId;
  @Input() room;
  @Input() editHidden;
  @Output() remove = new EventEmitter<Object>();
  constructor(
    private deviceService: DeviceService,
    private houseService: HouseService,
    private messageEvent: MessageEventService,
    private toastrService: ToastrService
  ) { }

  lightsOfScene = [];
  listOfLightsLeft = [];
  listOfAddLightsHidden = true;

  ngOnInit() {
    this.lightsOfScene = this.room.devices;
    this.houseService.getListOfDevicesInRoom(this.room.roomId).subscribe(res=>{
      let devices = res.devices;
      if(!!devices){
        for(let device of devices){
          if(device.deviceType==="LightingControl"){
            for(let light of device.lights){
              let found = this.lightsOfScene.filter(lightOfScene=>{
                return lightOfScene._id === light._id;
              }).pop();
              if(!found){
                this.listOfLightsLeft.push(light);
              }
            }
          }
        }
      }
    })
    // console.log(this.room.devices);
  }

  addLight(light){
    this.lightsOfScene.push(light);
    let index = this.listOfLightsLeft.indexOf(light);
    this.listOfLightsLeft.splice(index,1);
    let data = {
      _id: light._id,
      value: light.value
    }
    this.messageEvent.emit(this.sceneId + '/addLight', data);
    if(!this.listOfLightsLeft.length){
        this.listOfAddLightsHidden = true;
    }
  }

  removeLight(light){
    this.listOfLightsLeft.push(light);
    let index = this.lightsOfScene.indexOf(light);
    this.lightsOfScene.splice(index,1);
  }

  removeRoom(){
    if(!this.lightsOfScene.length){
      this.remove.emit(this.room);
    } else {
      this.toastrService.error('Please remove all items from the room before removing it!', 'Room is not empty!');
    }
  }
}
