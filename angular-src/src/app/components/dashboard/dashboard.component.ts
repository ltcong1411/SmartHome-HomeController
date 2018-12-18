import { Component, OnInit } from '@angular/core';
import { HouseService} from '../../services/rest-api/house.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  home: Object;
  constructor(
    private authService: HouseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getListOfFloors().subscribe(profile => {
      this.home = profile.home;
      console.log(this.home);
    },
    err => {
        console.log(err);
        return false;
    });
  }
}
