import { Component,  OnInit } from '@angular/core';
import { HouseService} from '../../../services/rest-api/house.service';
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.css']
})

export class ConfigHomeComponent implements OnInit {
  floorId: String;
  rooms: [{
    name: String,
    imgPath: String,
    modules: [String]
  }];
  checkClick = true;
  roomDeletedName: String;
  roomDeletedId: String;
  roomAddedName: String;
  roomUrlName: String;
  imgUrl: String;

  constructor(
                private flashMessage: FlashMessagesService,
                private houseService: HouseService,
                private router: Router,
                private route: ActivatedRoute,
                private toastrService: ToastrService
             ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']){
       this.floorId = params['id'];
       this.getRooms(this.floorId);
      }
    });
  }

  getRooms(floorId) {
    this.floorId = floorId;
    this.houseService.getListOfRooms(floorId).subscribe(res => {
      if(res.success===false){
        this.flashMessage.show(res.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.floorId = null;
      } else {
        if(res.length){
          this.rooms = res;
        } else {
          this.rooms = null;
          this.flashMessage.show('No room found. Please add new room!!!', {cssClass: 'alert-danger', timeout: 3000});
        }
      }
    })
  }

  addRoomSubmit(){
    this.checkClick = true;
    let newRoom = {
      "name": this.roomAddedName,
      "imgPath": this.roomUrlName
    }
    this.houseService.addNewRoom(this.floorId, newRoom).subscribe(res => {
      if(res.success){
        this.flashMessage.show('Success!!!', {cssClass: 'alert-success', timeout: 3000});
        this.getRooms(this.floorId);
      }else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-success', timeout: 3000});
      }
    })
  }
}
