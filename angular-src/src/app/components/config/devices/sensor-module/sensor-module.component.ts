import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { HouseService} from '../../../../services/rest-api/house.service';
import { DeviceService} from '../../../../services/rest-api/device.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';

@Component({
  selector: 'app-sensor-module',
  templateUrl: './sensor-module.component.html',
  styleUrls: ['./sensor-module.component.css']
})
export class SensorModuleComponent implements OnInit {
  @Input() sensorModule;
  @Output() deleteDeviceEvent = new EventEmitter();

  constructor(
              private flashMessage: FlashMessagesService,
              private houseService: HouseService,
              private deviceService: DeviceService,
              private router: Router
              ) { }

    listOfFloors:[{
      name: String,
      rooms:[{
        _id: String,
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
      this.houseService.getListOfFloors().subscribe(res=>{
        if(!res.success){
          console.log(res.msg)
        } else{
          this.listOfFloors = res.floors;
        }
        if(this.sensorModule.roomId){
          for(let i = 0; i < this.listOfFloors.length; i++){
            for(let j = 0; j < this.listOfFloors[i].rooms.length; j++){
              if(this.listOfFloors[i].rooms[j]._id == this.sensorModule.roomId){
                this.selectedRoom = this.listOfFloors[i].rooms[j].name;
                this.selectedFloor = this.listOfFloors[i].name;
                this.listOfRooms = this.listOfFloors[i].rooms;
                this.roomFoundFlag = true;
                break;
              }
            }
          }
        }
        if(!this.roomFoundFlag) {
          this.selectedFloor = "Select floor";
          this.selectedRoom = "Select room";
        }
        this.permission = this.sensorModule.allowToConnect;
      })
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
      this.deviceService.updateRoomId(this.sensorModule._id, query).subscribe(res=>{
        if(res.success){
          this.selectedRoom = room.name;
        } else {
          console.log("something went wrong");
        }
      })
    }

    values = '';

    lookup(sensorId){
      for(let i = 0; i < this.sensorModule.sensors.length; i++){
        if(this.sensorModule.sensors[i]._id == sensorId){
          return i;
        }
      }
      console.log("sensorId not found");
    }

    editName(sensorId, event: any) {
      let value = event.target.value;
      let index = this.lookup(sensorId);
      this.sensorModule.sensors[index].name = value;
    }

    selectKindOfSensor(sensorId, value){
      let index = this.lookup(sensorId);
      this.sensorModule.sensors[index].kind = value;
      this.saveBtnHidden = false;
    }

    save(){
      this.deviceService.updateSensorName(this.sensorModule._id, this.sensorModule.sensors).subscribe(res=>{
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
      this.deviceService.updatePermission(this.sensorModule._id, json).subscribe(res=>{
        if(!res.success){
          console.log("something went wrong")
        }
      })
    }

    deleteDevice(){
      this.deviceService.deleteDevice(this.sensorModule._id).subscribe(res=>{
        console.log(res);
        if(res.success){
          this.deleteDeviceEvent.emit();
        }
      })
    }
}
