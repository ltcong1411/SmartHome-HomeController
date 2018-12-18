import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import {HouseService} from '../../../services/rest-api/house.service';
import {UserService} from '../../../services/rest-api/user.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'

@Component({
  selector: 'app-config-navbar',
  templateUrl: './config-navbar.component.html',
  styleUrls: ['./config-navbar.component.css']
})
export class ConfigNavbarComponent implements OnInit {
  @Output() selectedFloor = new EventEmitter<String>();

  currentConfig: String;
  listOfFloorHidden = true;
  floors: Object;
  addFloorFlag = true;
  floorSelectedId: String;
  floorDeletedName: String;

  constructor(
    private houseService: HouseService,
    private authService: UserService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.currentConfig = localStorage.getItem('currentConfig');
    this.selectConfig(this.currentConfig);
    if (!this.floorSelectedId){
      this.floorSelectedId = "";
    }
  }


  selectConfig(config){
    localStorage.setItem('currentConfig', config);
    if(config == "home"){
      this.getListOfFloors();
      this.listOfFloorHidden = !this.listOfFloorHidden;
      this.floorSelectedId = localStorage.getItem('currentFloor');
    } else {
      this.listOfFloorHidden = true;
    }
  }

  getListOfFloors(){
    this.houseService.getListOfFloors().subscribe(res => {
      if(!res.success){
        console.log(res.msg)
      } else{
        this.floors = res.floors;
      }
    },
    err => {
        console.log(err);
        return false;
    });
  }


  addFloor(floorname){
    this.houseService.addNewFloor({"name":floorname}).subscribe(res => {
      if(res.success){
        this.flashMessage.show('Success!!!', {cssClass: 'alert-success', timeout: 3000});
        this.getListOfFloors();
      }else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-success', timeout: 3000});
      }
    });
    this.addFloorFlag = !this.addFloorFlag;
  }

  getFloor(name,floorId){
    localStorage.setItem('currentFloor', floorId);
    this.floorSelectedId = floorId;
    this.floorDeletedName = name;
  }

  deleteFloor(){
    this.houseService.deleteFloor(this.floorSelectedId).subscribe(res => {
      if(res.success){
        this.flashMessage.show('Success!!!', {cssClass: 'alert-success', timeout: 3000});
        this.getListOfFloors();
      }else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
      }
    });
  }

  checkSelectedFloor(floorId){
    if(floorId==this.floorSelectedId){
      return true;
    } else {
      return false;
    }
  }
}
