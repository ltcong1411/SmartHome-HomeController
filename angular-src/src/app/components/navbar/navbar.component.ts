import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/rest-api/user.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: UserService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.authService.logout();
    this.toastrService.success('You are logged out');
    this.router.navigate(['/login']);
    return false;
  }

}
