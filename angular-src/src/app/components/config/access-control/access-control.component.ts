import { Component, OnInit } from '@angular/core';
import { AccessControlService } from '../../../services/rest-api/access-control.service';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent implements OnInit {

  constructor(
    public accessControlService: AccessControlService
  ) { }

  listOfUsers: any;
  newUserName: String;

  ngOnInit() {
    this.getListOfUsers();
  }

  getListOfUsers(){
    this.accessControlService.getListOfUsers().subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
        this.listOfUsers = [];
      } else {
        this.listOfUsers = res.users;
      }
    })
  }

  adduserSubmit(newUserName){
    let newUser = {
      name: newUserName
    }
    this.accessControlService.addNewUser(newUser).subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      } else {
        this.getListOfUsers();
      }
    })
  }

}
