import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {UserService} from '../services/rest-api/user.service';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: UserService, private router: Router){};

  canActivate(){
    if(this.authService.loggedIn()){
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
