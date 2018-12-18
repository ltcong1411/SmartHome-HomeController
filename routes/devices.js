 const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const LightingControl = require('../mongodb/home-model/lightingControl');
const SensorModule = require('../mongodb/home-model/sensorModule');
const Devices = require('../mongodb/home-model/devices');
const Floors = require('../mongodb/home-model/floor');


router.get('/', (req, res, next)=>{
  Devices.getListOfDevices()
  .then(devices=>{
    res.json(devices);
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
})

router.put('/:id/room-id', (req, res, next) => {
  let deviceId = req.params.id;
  let roomId = req.body.roomId;

  Devices.updateRoomId(deviceId, roomId)
  .then(result=>{
    res.json({success: true, msg: result});
    return Promise.resolve(true)
  })
  .then(()=>{
    return Floors.updateDeviceToRoom(deviceId, roomId)
  })
  .then(result=>{
    console.log(result);
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.put('/:id/permission', (req, res, next) => {
  let deviceId = req.params.id;
  let permission = req.body.permission;

  Devices.updatePermission(deviceId, permission)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.put('/:id/lights', (req, res, next) => {
  let deviceId = req.params.id;
  let lightingcontrol = req.body;
  LightingControl.updateLights(deviceId, lightingcontrol)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.put('/:id/sensors', (req, res, next) => {
  let deviceId = req.params.id;
  let sensorModule = req.body;
  SensorModule.updateSensorName(deviceId, sensorModule)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.get('/lighting-controls/lights/:id', (req, res, next)=>{
  let lightId = req.params.id;
  LightingControl.getLightDetails(lightId)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.get('/sensor-modules/sensors/:id', (req, res, next)=>{
  let sensorId = req.params.id;
  SensorModule.getSensorDetails(sensorId)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message});
  })
})

router.get('/items/:id', (req, res, next)=>{
  let itemId = req.params.id;
  LightingControl.getLightDetails(itemId)
  .then(light=>{
    res.json({success: true, _type: 'light', light: light});
  },
  (notFoundLight)=>{
    return SensorModule.getSensorDetails(itemId)
    .then(sensor=>{
      res.json({success: true, _type: 'sensor', sensor: sensor});
    })
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
})

router.delete('/:id', (req, res, next)=>{
  let deviceId = req.params.id;
  Devices.deleteDevice(deviceId)
  .then(result=>{
    res.json({success: true, msg: 'device has been deleted'})
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
})

module.exports = router;
