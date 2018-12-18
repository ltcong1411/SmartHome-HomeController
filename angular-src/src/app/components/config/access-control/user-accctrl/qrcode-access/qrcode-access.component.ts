import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidateService} from '../../../../../services/validate.service';
import { UserService} from '../../../../../services/rest-api/user.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-qrcode-access',
  templateUrl: './qrcode-access.component.html',
  styleUrls: ['./qrcode-access.component.css']
})
export class QrcodeAccessComponent implements OnInit {
  @Output() backEvent = new EventEmitter();
  @Output() isQRAvailable = new EventEmitter<Boolean>();
  @Input() user;
 

  name: String;
  email: String;
  filteredUsers=[];
  users: any;
  userSelectedId: String;
  userDeletedName: String;
  deleteUsers = [];
  success: boolean = true;
  test: boolean;
  effort: boolean = false;
  noUsers: boolean;
  
  constructor(
    private validateService: ValidateService,
            private flashMessage: FlashMessagesService,
            private authService: UserService,
            private router: Router,
            private toastrService: ToastrService
 ) { }

ngOnInit() {
this.getListOfusers();
}


onQRcodeSubmit(){
 
const QRuser = {
  name: this.name,
  email: this.email,
  _userId: this.user._id
}
console.log(QRuser)
// Required Fields
if(!this.validateService.validateQRcode(QRuser)) {
this.toastrService.error('Oops! please fill all fields', 'Error', { timeOut: 1000 });
return false;
}
// Required Email
//if(!this.validateService.validateEmail(user.email)) {
//  this.flashMessage.show('Invalid Email', {cssClass: 'alert-danger', timeout: 3000});
//  return false;
//}
// Register QRcode
this.authService.registerQRcode(QRuser).subscribe(data => {
  if(data.success){
    this.toastrService.success('Created!', 'Success', { timeOut: 1000 });
    } else {
    this.toastrService.error('Oops! please try later', 'Error', { timeOut: 1000 });
    
  }
})

this.getListOfusers();
}

getuser(name,userId){
this.userSelectedId = userId;
this.test = (document.getElementById(userId) as HTMLInputElement).checked

if (this.test){
this.deleteUsers.push(this.userSelectedId);
}
else{
  for(let i=0; i<this.deleteUsers.length; i++){
  if (this.userSelectedId == this.deleteUsers[i] ){
    this.deleteUsers.splice(i,1);
     }
  
}
}
}

getListOfusers(){
this.filteredUsers = [];
this.authService.getListOfQRcodes().subscribe(res => {
if(!res.success){
this.filteredUsers = [];
} else{
  this.users = res.users;
  for(let usr of this.users){
    if (usr.userId == this.user._id){
       this.filteredUsers.push(usr);
    }
  }
}
if(this.filteredUsers.length == 0) {this.noUsers=true}
else {this.noUsers=false}
});

}

deleteUser(){
  if(this.effort == false){
    for(let i=0; i<this.deleteUsers.length; i++){
      this.authService.deleteUser(this.deleteUsers[i]).subscribe(res => {});
    }
    this.effort = true;
  

  for(let i=1; i<this.deleteUsers.length; i++){
    this.authService.deleteUser(this.deleteUsers[i]).subscribe(res => {
      if(res.success){
        
        this.success = true;
                } else {
                 
                    this.success = false; 
                        }
         })
    if (this.success == false) break;
      }
    } else {
      for(let i=0; i<this.deleteUsers.length; i++){
        this.authService.deleteUser(this.deleteUsers[i]).subscribe(res => {
          if(res.success){
            
            this.success = true;
                    } else {
                     
                        this.success = false; 
                            }
             })
        if (this.success == false) break;
          }
    }  
  
if (this.success){
this.toastrService.success('deleted!', 'Success', { timeOut: 1000 });
    } else {
this.toastrService.error('Oops! please try later', 'Error', { timeOut: 1000 });
        }
this.deleteUsers=[];
this.getListOfusers()

}

DeleteAll(){
  this.filteredUsers = [];
  this.authService.getListOfQRcodes().subscribe(res => {
  if(!res.success){
  this.filteredUsers = [];
  } else{
    this.users = res.users;
    for(let usr of this.users){
      if (usr.userId == this.user._id){
         this.filteredUsers.push(usr);
      }
    }
  } 
  for(let i=0; i<this.filteredUsers.length; i++){
    this.authService.deleteUser(this.filteredUsers[i]._id).subscribe(res => {
      this.getListOfusers();
    });
  }
  
  });
  

}


back(){
  this.backEvent.emit();
      }
}
