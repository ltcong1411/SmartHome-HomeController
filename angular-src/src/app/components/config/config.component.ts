import { Component, OnInit } from '@angular/core';
import { HouseService} from '../../services/rest-api/house.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(
                private flashMessage: FlashMessagesService,
                private houseService: HouseService,
                private router: Router,
             ) { }

  ngOnInit() {
  }



}
