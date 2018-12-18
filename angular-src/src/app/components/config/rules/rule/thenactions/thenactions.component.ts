import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MessageEventService } from '../../../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-thenactions',
  templateUrl: './thenactions.component.html',
  styleUrls: ['./thenactions.component.css']
})
export class ThenactionsComponent implements OnInit, OnChanges {
  @Input() ruleId;
  @Input() thenActions;
  @Input() editHidden;
  @Input() listOfDevicesInHouse;
  @Output() updateActions = new EventEmitter();
  constructor(
    private messageEvent: MessageEventService
  ) { }

  ngOnInit() {
    if(!this.thenActions.length){
      this.thenActions.push({
        typeOfAction: "deviceAction"
      })
    }
  }

  ngOnChanges(){
    // console.log(this.thenActions);
  }

  deleteAction(msg){
    let index = msg.order;
    this.thenActions.splice(index,1);
  }

  addDeviceAction(){
    let newAction = {
      typeOfAction: "deviceAction",
      value: 0
    }
    this.thenActions.push(newAction);
  }

  addMobileAction(){
    let newAction = {
      typeOfAction: "mobileAction",
      typeOfMobileAction: "CALL"
    }
    this.thenActions.push(newAction);
  }

  updateAction(){
    this.updateActions.emit();
  }

}
