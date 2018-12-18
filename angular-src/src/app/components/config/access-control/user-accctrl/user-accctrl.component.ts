import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { AccessControlService } from '../../../../services/rest-api/access-control.service';
import { MessageEventService } from '../../../../services/broadcast/message-event.service';
import { UserService } from '../../../../services/rest-api/user.service';
@Component({
  selector: 'app-user-accctrl',
  templateUrl: './user-accctrl.component.html',
  styleUrls: ['./user-accctrl.component.css']
})
export class UserAccctrlComponent implements OnInit, OnChanges {
  @Input() user;
  @Output() deleteUserEvent = new EventEmitter();

  constructor(
    public accessControlService: AccessControlService,
    public messageEvent: MessageEventService,
    public userService : UserService
  ) { }
  users: any;
  filteredUsers = [];
  main_row_hidden = false;
  fingerprint_hidden = true;
  face_hidden = true;
  qr_hidden = true;
  grayFilter = {filter: 'grayscale(100%)', color: 'gray'};
  isQRAvailable = false;
  isFingerprintAvailable = false;
  avatar: String;

  ngOnInit() {
    if(!this.user.imgPath){
      this.user.imgPath = "./assets/images/avatars/NoAvatar.jpg";
    }
    this.isFingerprintAvailable = !!this.user.fingerprintId.length;
    this.avatar = this.user.imgPath;
    this.getQRcodeInUser();
  }

  ngOnChanges(){
    
  }

  getQRcodeInUser(){  
    this.userService.getListOfQRcodes().subscribe(data =>{
      if(data.success){
       this.users = data.users;
       for(let usr of this.users){
         if (usr.userId == this.user._id){
            this.filteredUsers.push(usr);
         }
        }
        this.isQRAvailable = !!this.filteredUsers.length;
      } else {
        this.filteredUsers = [];
        
       }
      })
    }

  addImgSubmit(imgPath){
    this.user.imgPath = imgPath;
    let body = {
      imgPath: imgPath
    }
    this.accessControlService.updateImgPath(this.user._id, body).subscribe(res=>{
      if(!res.success){
        console.log(res.msg)
      }
    })
  }

  deleteUser(){
    this.accessControlService.deleteUser(this.user._id).subscribe(res=>{
      console.log(res);
      this.deleteUserEvent.emit();
    })
    this.filteredUsers = [];
    this.userService.getListOfQRcodes().subscribe(res => {
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
      this.userService.deleteUser(this.filteredUsers[i]._id).subscribe(res => {});
    }
    });
    
  }

  show_main_row(){
    this.main_row_hidden = false;
    this.fingerprint_hidden = true;
    this.face_hidden = true;
    this.qr_hidden = true;
    this.getQRcodeInUser();
  }

  show_fingerprint_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = false;
    this.face_hidden = true;
    this.qr_hidden = true;
  }

  show_face_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = true;
    this.face_hidden = false;
    this.qr_hidden = true;
  }

  show_qrcode_row(){
    this.main_row_hidden = true;
    this.fingerprint_hidden = true;
    this.face_hidden = true;
    this.qr_hidden = false;

  }

}
