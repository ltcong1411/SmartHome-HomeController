import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/rest-api/user.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(
    private userService: UserService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }
    this.userService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.userService.storeUserData(data.token, data.user);
        this.toastrService.success('You are logged in!', 'Success');
        this.router.navigate(['/config']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['/login']);
      };
    });
  }
}
