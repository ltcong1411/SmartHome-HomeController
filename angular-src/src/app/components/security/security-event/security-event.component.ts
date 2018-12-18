import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MessageEventService} from '../../../services/broadcast/message-event.service';

@Component({
  selector: 'app-security-event',
  templateUrl: './security-event.component.html',
  styleUrls: ['./security-event.component.css']
})
export class SecurityEventComponent implements OnInit {
  @Output() showModal = new EventEmitter<Object>();
  constructor(
    private messageEvent: MessageEventService
  ) { }

  ngOnInit() {
    // console.log("hello")
    this.messageEvent.on('security-event').subscribe(message=>{
      console.log(message);
      this.showModal.emit(message)
    })
  }

}
