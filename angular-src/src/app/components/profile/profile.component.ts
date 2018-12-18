import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/rest-api/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  constructor(
    private authService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      console.log(this.user);
    },
    err => {
        console.log(err);
        return false;
    });
  }
}
