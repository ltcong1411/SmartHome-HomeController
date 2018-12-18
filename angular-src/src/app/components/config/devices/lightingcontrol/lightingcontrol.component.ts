import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { HouseService} from '../../../../services/rest-api/house.service';
import { DeviceService} from '../../../../services/rest-api/device.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';

@Component({
  selector: 'app-lightingcontrol',
  templateUrl: './lightingcontrol.component.html',
  styleUrls: ['./lightingcontrol.component.css']
})
export class LightingcontrolComponent implements OnInit {
  @Input() lightingControl;
  @Output() deleteDeviceEvent = new EventEmitter();
  constructor(
              private flashMessage: FlashMessagesService,
              private houseService: HouseService,
              private deviceService: DeviceService,
              private router: Router
              ) { }

  listOfFloors: [{
    name: String
    rooms: [{
      _id
      name: String
    }]
  }];
  listOfRooms: [{
    _id: String,
    name: String
  }];
  selectedFloor: String;
  selectedRoom: String;
  roomFoundFlag = false;
  saveBtnHidden = true;
  permission: Boolean;

  ngOnInit() {
    let roomId = this.lightingControl.roomId;
    this.houseService.getListOfFloors().subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      } else{
        this.listOfFloors = res.floors;
      }
      if(!!roomId){
        this.houseService.getFloorAndRoomByRoomId(roomId).subscribe(res=>{
          if(!res.success) {
            console.log(res.msg)
            this.selectedFloor = "Select floor";
            this.selectedRoom = "Select room";
          }
          else {
            let result = res.result;
            this.selectedFloor = result.floorName;
            this.selectedRoom = result.roomName;
            let floor = this.listOfFloors.filter(floor=>{
              return floor.name == this.selectedFloor;
            }).pop()
            this.listOfRooms = floor.rooms;
          }
        })
      } else {
        this.selectedFloor = "Select floor";
        this.selectedRoom = "Select room";
      }
    })

    this.permission = this.lightingControl.allowToConnect;
  };

  selectFloor(floor){
    this.selectedFloor = floor.name;
    this.selectedRoom = "Select room";
    this.listOfRooms = floor.rooms;
  }

  selectRoom(room){
    let query = {
      roomId: room._id
    }
    this.deviceService.updateRoomId(this.lightingControl._id, query).subscribe(res=>{
      if(res.success){
        this.selectedRoom = room.name;
      } else {
        console.log("something went wrong");
      }
    })
  }

  values = '';

  lookup(lightId){
    for(let i = 0; i < this.lightingControl.lights.length; i++){
      if(this.lightingControl.lights[i]._id == lightId){
        return i;
      }
    }
    console.log("lightId not found");
  }

  edit(lightId, event: any) { // without type info
    console.log(event);
    let field = event.target.name;
    let value = event.target.value;
    let index = this.lookup(lightId);
    switch(field){
      case "name":
        this.lightingControl.lights[index].name = value;
        break;
      case "type":
        this.lightingControl.lights[index].typeOfLight = value;
        break;
      case "power":
        this.lightingControl.lights[index].power = Number(value);
        break;
      case "life_time":
        this.lightingControl.lights[index].life_time = Number(value);
        break;
    }
  }

  selectKindOfLight(lightId, value){
    let index = this.lookup(lightId);
    this.lightingControl.lights[index].typeOfLight = value;
    this.saveBtnHidden = false;
  }


  save(){
    this.deviceService.updateLights(this.lightingControl._id, this.lightingControl).subscribe(res=>{
      if(!res.success){
        console.log("something went wrong");
      }
    })
    this.saveBtnHidden = true;
  }

  showSaveBtn(){
    this.saveBtnHidden = false;
  }

  changePermission(){
    let json = {
      'permission': this.permission
    }
    this.deviceService.updatePermission(this.lightingControl._id, json).subscribe(res=>{
      console.log(res);
    })
  }

  deleteDevice(){
    this.deviceService.deleteDevice(this.lightingControl._id).subscribe(res=>{
      console.log(res);
      if(res.success){
        this.deleteDeviceEvent.emit();
      }
    })
  }

}
