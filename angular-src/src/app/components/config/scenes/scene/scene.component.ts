import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { SceneService} from '../../../../services/rest-api/scene.service';
import { HouseService} from '../../../../services/rest-api/house.service';
import {MessageEventService} from '../../../../services/broadcast/message-event.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, OnChanges {
  @Input() scene;
  @Output() removeScene = new EventEmitter();

  constructor(
    private sceneService: SceneService,
    private houseService: HouseService,
    private messageEvent: MessageEventService,
    private toastrService: ToastrService
  ) {
    this.options = new DatePickerOptions();
  }

  sceneId:String;
  date: DateModel;
  options: DatePickerOptions;
  timePickerHidden = true;
  repeatDayHidden = true;
  TimeButtonsHidden = true;
  timePicker: String;
  time: Date;
  repeatPicker: String;
  repeatDays = [];
  repeatDaysStr: String;
  daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  daysOfWeekFull = ["Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  rooms = [];

  //--add Room--//
  selectRoomHidden = true;
  listOfFloors = [];
  listOfRooms = [];
  selectedFloor: String;
  selectedRoom: String;
  //--add Room--//

  btnSaveHidden = true;
  editHidden = true;

  sceneDeletedName: String;


  ngOnInit() {
    this.rooms = [];
    this.sceneId = this.scene._id;
    this.sceneService.getDevicesDetail(this.sceneId).subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      } else {
        this.rooms = res.rooms;
      }
    })
    if(!!this.scene.time){
      this.timePicker = this.scene.time;
      this.time = moment(this.timePicker, "HH:mm A").toDate();
    }

    this.date = new DateModel();
    if(!!this.scene.date){
      this.mapDate(this.scene.date);
    }

    if(!!this.scene.repeat){
      this.repeatDaysStr = this.scene.repeat;
      this.repeatDays = this.mapRepeatDays(this.repeatDaysStr);
    }

    if(!this.scene.devices.length){
      this.editHidden = false;
    }

    this.houseService.getListOfFloors().subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      } else{
        this.listOfFloors = res.floors;
      }
    })

    this.selectedFloor = "select floor";
    this.selectedRoom = "select room";

    this.messageEvent.on(this.sceneId + '/changeLightValue').subscribe((light:any)=>{
      this.btnSaveHidden = false;
      for(let device of this.scene.devices){
        if(device._id==light._id){
          device.value = light.value;
          break;
        }
      }
    })

    this.messageEvent.on(this.sceneId + '/addLight').subscribe(light=>{
      this.scene.devices.push(light);
    })

    this.messageEvent.on(this.sceneId + '/removeLight').subscribe((light:any)=>{
      let devices = this.scene.devices;
      for(let i=0; i<devices.length; i++){
        if(devices[i]._id==light._id){
          this.scene.devices.splice(i,1);
          break;
        }
      }
    })
  }

  ngOnChanges(){
    // console.log(this.date);
  }

  mapDate(date){
    let now = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(now.getDate()+1);
    let nowMoment = moment(now).format('DD/MM/YYYY');
    let tomorrowMoment = moment(tomorrow).format('DD/MM/YYYY');
    if(date===nowMoment){
      this.date.formatted = 'Today';
    } else if(date===tomorrowMoment){
      this.date.formatted = 'Tomorrow';
    } else {
      this.date.formatted = date;
    }
    this.date.momentObj = moment(date, "DD MM YYYY");
  }

  mapRepeatDays(repeatDaysStr){
    var array = repeatDaysStr.split(", ");
    let repeatDays = [false, false, false, false, false, false, false];
    for(let date of array){
      let index = this.daysOfWeek.indexOf(date);
      repeatDays[index] = true;
    }
    return repeatDays;
  }

  convertRepeatToString(repeatDays){
    let string;
    if(repeatDays[0]&&repeatDays[1]&&repeatDays[2]&&repeatDays[3]&&repeatDays[4]&&repeatDays[5]&&repeatDays[6]){
      string = "Daily";
    } else if((!repeatDays[0])&&(!repeatDays[1])&&(!repeatDays[2])&&(!repeatDays[3])&&(!repeatDays[4])&&(!repeatDays[5])&&(!repeatDays[6])){
      string = "None";
    }
    else{
      string = "";
      for(let i=0; i<repeatDays.length;i++){
        if(repeatDays[i]){
          string += this.daysOfWeek[i] + ", ";
        }
      }
      string = string.slice(0, -2);
    }
    return string;
  }

  clickTimeOkBtn(){
    this.timePickerHidden=true;
    this.TimeButtonsHidden=true;
    this.btnSaveHidden=false;
    if(!this.time){
      this.time = new Date();
    }
    this.timePicker = moment(this.time).format('LT');
  }

  clickClearOkBtn(){
    this.timePickerHidden=true;
    this.TimeButtonsHidden=true;
    this.btnSaveHidden=false;
    this.timePicker = '';
    this.time = null;
  }

  clickRepeatOkBtn(){
    this.repeatDayHidden = true;
    this.btnSaveHidden=false;
    this.repeatDaysStr = this.convertRepeatToString(this.repeatDays);
  }


  selectFloor(floor){
    this.listOfRooms = floor.rooms;
    this.selectedFloor = floor.name;
  }

  selectRoom(selectedRoom){
    console.log(this.rooms);
    let check = this.rooms.filter(room=>{
      return room.roomId == selectedRoom._id;
    }).pop();
    if(!check){
      let room = {
        floorName: this.selectedFloor,
        roomName: selectedRoom.name,
        roomId: selectedRoom._id,
        devices: []
      }
      this.rooms.push(room);
    };
    this.selectedFloor = "select floor";
  }

  removeRoom(room){
    let index = this.rooms.indexOf(room);
    this.rooms.splice(index,1);
  }

  clickSaveBtn(){
    if(!this.scene.devices.length){
      this.editHidden = false;
    }

    let isDatePicked = !!this.date.formatted;
    let isTimePicked = !!this.time;
    let isRepeatDateNone = (this.repeatDaysStr=='None');

    if((!isTimePicked)&&(isDatePicked||(!isRepeatDateNone))){
      this.toastrService.error('Please pick Time.', 'Error!!!');
      return;
    }

    if((isTimePicked)&&((!isDatePicked)&&(isRepeatDateNone))){
      let date = new Date();
      if(date.getTime() > this.time.getTime()){
        date.setDate(date.getDate()+1);
      }
      this.mapDate(moment(date).format('DD/MM/YYYY'));
    }

    if((isTimePicked)&&(isDatePicked)){

    }

    this.scene.time = (this.time)? moment(this.time).format('LT'): null;
    this.scene.date = (this.date.momentObj)? this.date.momentObj.format('DD/MM/YYYY'): null;
    this.scene.repeat = this.repeatDaysStr;

    this.sceneService.updateScene(this.scene).subscribe(res=>{
      if(!res.success){
        console.log(res.msg);
      }
    })

    this.editHidden = true;
    this.btnSaveHidden = true;
  }

  deleteScene(){
    this.sceneService.deleteScene(this.sceneId).subscribe(res=>{
      if(res.success){
        this.removeScene.emit();
      } else {
        console.log(res.msg);
      }
    })
  }

  datePickerEvent(event){
    if(event.type=='dateChanged'){
      let date = event.data.formatted;
      this.mapDate(date);
    }
  }

  runScene(){
    for(let device of this.scene.devices){
      this.messageEvent.emit("device-event", device);
    }
  }
}
