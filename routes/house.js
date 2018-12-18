const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Floor = require('../mongodb/home-model/floor');
const Devices = require('../mongodb/home-model/devices');


//------------FLOOR API--------------//
//Get list of floors
router.get('/floors', (req, res, next) => {
  Floor.getListOfFloors()
  .then(floors=>{
    res.json({success: true, floors: floors});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//Add new floor
router.post('/floors', (req, res, next) => {
  let newFloor = new Floor({
      name: req.body.name,
      rooms: []
  });
  Floor.addfloor(newFloor)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//Delete floor
router.delete('/floors/:id', (req, res, next) => {
  floorId = req.params.id;
  Floor.deletefloor(floorId)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});



  //------------Room API--------------//
//get list of rooms in the floor which has _id = req.params.id
router.get('/floors/:floorid/rooms', (req, res, next) => {
  let floorId = req.params.floorid;
  Floor.getListOfRooms(floorId)
  .then(rooms=>{
    res.json(rooms)
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//delete room
router.delete('/floors/:floorid/rooms/:id', (req, res, next) => {
  roomId = req.params.id;
  Floor.deleteRoom(roomId)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//Add new room
router.post('/floors/:id/rooms', (req, res, next) => {
  let floorId = req.params.id;
  let newRoom = {
      name: req.body.name,
  };

  Floor.addNewRoom(floorId, newRoom)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

//update imgPath to room
router.put('/floors/:floorid/rooms/:id/imgPath', (req, res, next) => {
  floorId = req.params.floorid;
  roomId = req.params.id;
  imgPath = req.body.imgPath;
  Floor.updateImgPath(floorId, roomId, imgPath)
  .then(result=>{
    res.json({success: true, msg: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

// get list of devices in the house
router.get('/devices', (req, res, next) => {
  Floor.getListOfItemsInHouse()
  .then(result=>{
    res.json({success: true, house: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});

// get list of devices in the room
router.get('/floors/rooms/:roomid/devices', (req, res, next) => {
  let roomId = req.params.roomid;
  Devices.getListOfDevicesInRoom(roomId)
  .then(result=>{
    res.json({success: true, devices: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
});


//find Floor and Room by RoomId
router.get('/floors/rooms/:id',(req, res, next) => {
  let roomId = req.params.id;
  Floor.getFloorAndRoomByRoomId(roomId)
  .then(result=>{
    res.json({success: true, result: result});
  })
  .catch(err=>{
    console.log(err)
    res.json({success: false, msg: err.message})
  })
})


module.exports = router;


//, passport.authenticate('authenticate', {session:false})
