import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { RuleService } from '../../../../services/rest-api/rule.service';
import { HouseService } from '../../../../services/rest-api/house.service';
import { MessageEventService } from '../../../../services/broadcast/message-event.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent implements OnInit {
  @Input() rule;
  @Input() listOfDevicesInHouse;
  @Input() listOfUsers;
  @Output() removeRule = new EventEmitter();

  constructor(
    private ruleService: RuleService,
    private houseService: HouseService,
    private messageEvent: MessageEventService,
    private toastrService: ToastrService
  ) {
    this.options = new DatePickerOptions();
  }

  listOfDevicesInHouseFull: any;
  ruleId:String;
  date: DateModel;
  options: DatePickerOptions;
  fromTimePickerHidden = true;
  toTimePickerHidden = true;
  TimePickerHidden = true;

  time: any;
  fromTimeButtonsHidden = true;
  toTimeButtonsHidden = true;
  TimeButtonsHidden = true;

  repeatDayHidden = true;
  fromTimePicker: String;
  toTimePicker: String;
  fromTime: Date;
  toTime: Date;
  repeatDays = [];
  repeatDaysStr: String;
  daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  daysOfWeekFull = ["Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  btnSaveHidden = true;
  editHidden = true;

  ruleDeletedName: String;

  ifCondtions: Object;
  thenActions: Object;

  isAllDayChecked = true;
  allDayChecboxHidden = true;

  isNextDay = false;

  ngOnInit() {
    // console.log(this.listOfUsers);
    this.ruleId = this.rule._id;

    this.ifCondtions = this.rule.ifConditions;
    this.thenActions = this.rule.thenActions;
    this.time = this.rule.time;

    this.fromTimePicker = 'null';
    this.toTimePicker = 'null';
    this.isAllDayChecked = true;

    if((!!this.time)){
      if(!this.time.isAllDay){
        this.isAllDayChecked = false;
        this.fromTimePicker = this.rule.time.from;
        this.toTimePicker = this.rule.time.to;
        this.fromTime = moment(this.fromTimePicker, "HH:mm A").toDate();
        this.toTime = moment(this.toTimePicker, "HH:mm A").toDate();
        this.isNextDay = this.toTime.getTime() < this.fromTime.getTime();
      }
    }

    if(!!this.rule.repeat){
      this.repeatDaysStr = this.rule.repeat;
    } else {
      this.repeatDaysStr = 'Daily';
    }
    this.repeatDays = this.mapRepeatDays(this.repeatDaysStr);

  }


  mapRepeatDays(repeatDaysStr){
    var array = repeatDaysStr.split(", ");
    let repeatDays = [false, false, false, false, false, false, false];
    if(repeatDaysStr==='Daily') return [true, true, true, true, true, true, true];
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

  clickAllDayCheckbox(isChecked){
    this.btnSaveHidden = false;
    this.TimeButtonsHidden = true;
    this.toTimePickerHidden = true;
    this.fromTimePickerHidden = true;
    this.isAllDayChecked = isChecked;
  }

  clickTimeOkBtn(){
    this.toTimePickerHidden=true;
    this.fromTimePickerHidden=true;
    this.TimeButtonsHidden=true;
    this.btnSaveHidden=false;

    if(!this.toTime){
      this.toTime =  new Date();
    }

    if(!this.fromTime){
      this.fromTime = new Date();
    }

    this.isNextDay = this.toTime.getTime() < this.fromTime.getTime();

    this.toTimePicker = moment(this.toTime).format('LT');
    this.fromTimePicker = moment(this.fromTime).format('LT');

  }

  clickFromTimeClearOkBtn(){
    this.btnSaveHidden=false;
    this.fromTimePickerHidden=true;
    this.fromTimeButtonsHidden=true;
    this.fromTimePicker = '';
    // this.time = null;
  }

  clickToTimeClearOkBtn(){
    this.btnSaveHidden=false;
    this.toTimePickerHidden=true;
    this.toTimeButtonsHidden=true;
    this.toTimePicker = '';
    // this.time = null;
  }

  clickRepeatOkBtn(){
    this.repeatDayHidden = true;
    this.btnSaveHidden=false;
    this.repeatDaysStr = this.convertRepeatToString(this.repeatDays);
  }


  clickSaveBtn(){
    this.editHidden = true;
    this.btnSaveHidden = true;

    this.rule.repeat = this.repeatDaysStr;

    if(this.isAllDayChecked){
      this.rule.time = {
        isAllDay: true
      }
    } else {
      this.rule.time = {};
      this.rule.time.from = this.fromTimePicker;
      this.rule.time.to = this.toTimePicker;
    }

    console.log(this.rule);
    this.ruleService.updateRule(this.rule).subscribe(res=>{
      if(!res.success){
        console.log(res.msg);
      }
    })
  }

  deleteRule(){
    this.ruleService.deleteRule(this.ruleId).subscribe(res=>{
      if(res.success){
        this.removeRule.emit();
      } else {
        console.log(res.msg);
      }
    })
  }

  // datePickerEvent(event){
  //   if(event.type=='dateChanged'){
  //     let date = event.data.formatted;
  //     this.mapDate(date);
  //   }
  // }

  runrule(){
    // for(let device of this.rule.devices){
    //   this.messageEvent.emit("device-event", device);
    // }
  }

  updateIfCond(operation){
    this.rule.ifConditions = operation;
    // console.log(this.rule.ifConditions);
  }

  updateActions(){
    this.btnSaveHidden = false;
  }
}
