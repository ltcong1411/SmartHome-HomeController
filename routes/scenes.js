 const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const LightingControl = require('../mongodb/home-model/lightingControl');
const SensorModule = require('../mongodb/home-model/sensorModule');
const Scenes = require('../mongodb/home-model/scenes');



router.get('/', (req, res, next)=>{
  Scenes.getListOfScenes()
  .then(result=>{
    res.json({success: true, scenes: result})
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message})
  })
})

router.get('/:id/devices', (req, res, next)=>{
  let sceneId = req.params.id;
  Scenes.findSceneById(sceneId)
  .then(scene=>{
    if(!scene.devices.length) return Promise.resolve([])
    return LightingControl.getLightsDetails(scene.devices)
  })
  .then(result=>{
    res.json({success: true, rooms: result});
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message})
  })
})

router.post('/', (req, res, next)=>{
  let newScene = req.body;
  Scenes.addNewScene(newScene)
  .then(result=>{
    res.json({success: true, msg: result})
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message})
  })
})

router.put('/:id', (req, res, next)=>{
  let sceneId = req.params.id;
  let newScene = req.body;
  Scenes.updateScene(sceneId, newScene)
  .then(result=>{
    res.json({success: true, msg: result})
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message})
  })
})

router.delete('/:id', (req, res, next)=>{
  let sceneId = req.params.id;
  Scenes.deleteScene(sceneId)
  .then(result=>{
    res.json({success: true, msg: result})
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message})
  })
})

module.exports = router;
