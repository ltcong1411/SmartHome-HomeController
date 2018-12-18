import { Component, OnInit } from '@angular/core';
import { SceneService} from '../../../services/rest-api/scene.service';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.component.html',
  styleUrls: ['./scenes.component.css']
})
export class ScenesComponent implements OnInit {
  constructor(
    private sceneService: SceneService
  ) { }

  scenes: any;
  newSceneName: String;

  ngOnInit() {
    this.getListOfScenes();
  }

  getListOfScenes(){
    this.sceneService.getListOfScenes().subscribe(res=>{
      if(!res.success){
        console.log(res.msg);
        this.scenes = [];
      } else {
        this.scenes = res.scenes;
      }
    })
  }

  addsceneSubmit(){
    let newScene = {
      name: this.newSceneName
    }
    this.sceneService.addNewScene(newScene).subscribe(res=>{
      if(res.success){
        this.getListOfScenes();
      }
    })
  }

}
