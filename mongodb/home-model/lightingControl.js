const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

const LightingControlSchema = new Schema({
    deviceCode: String,         // Ex: 'ltctrl12c5'
    deviceType: String,         // 'LightingControl'
    numberOfPorts: Number,      // Ex: '1 port', '4 port', '8 port', ...
    allowToConnect: Boolean,
    roomId: Schema.Types.ObjectId,
    lights: [
      {
          portId: Number,
          name: String,           // Ex: 'Light 1', 'Light 2',...
          typeOfLight: String,    // Ex: 'Neon', 'Compact',...
          dimmable: Boolean,      // Ex: 'ON/OFF', 'DIM'
          life_time: Number,      // Ex: 6000 hours
          power: Number,          // Ex: 60 watt
          value: Number
      }
    ]
}, {collection: "devices", versionKey: false});


const LightingControl = module.exports = mongoose.model('LightingControl', LightingControlSchema);
const Floor = require('./floor');

module.exports.findAndUpdateLight = function (lightId, value) {
  return LightingControl.findOne({'lights._id' : lightId})
  .then(device=>{
    if(!device) throw new Error('Device not found: ' + lightId)
    let light = device.lights.id(lightId);
    light.value = value;
    return device.save().then(device=>{
      return Promise.resolve({deviceId: device._id, portId: light.portId, dimmable: light.dimmable, typeOfLight: light.typeOfLight})
    })
  })
}

module.exports.authenticateDevices = function(data) {
  return LightingControl.findOne({deviceCode: data.deviceCode})
  .then(device=>{
    if(!!device) return Promise.resolve(device)
    let newDevice = new LightingControl(data);
    return newDevice.save().then(device=>{
      return Promise.resolve(device)
    })
  })
};

module.exports.updateLights = function(deviceId, lightingControl){
  return LightingControl.findById(deviceId)
  .then(ltctrl=>{
    if(!ltctrl) throw new Error('LightingControl not found: ' + deviceId)
    ltctrl.lights = lightingControl.lights;
    return ltctrl.save()
  })
  .then(()=>{
    return Promise.resolve('The lights has been updated to module')
  })
}

module.exports.getLightDetails = function(lightId){
  return LightingControl.findOne({"lights._id": lightId})
  .then(device=>{
    if(!device) throw new Error('No LightingControl has light: ' + lightId)
    let light = device.lights.id(lightId);
    return Promise.resolve(light)
  })
}

module.exports.getLightsDetails = function(listOfLights){
  let rooms = [];
  let roomIndexArr = [];
  let index = 0;
  let forLoopFinshCheck = 0;
  let forLoop = (i) => {
    let lightOfScene = listOfLights[i];
    let lightId = lightOfScene._id;
    return LightingControl.findOne({"lights._id": lightId})
    .then(device=>{
      if(!device) return new Error('Light not found: ' + lightId)
      let light = device.lights.id(lightId);
      light.value = lightOfScene.value;
      let roomId = device.roomId;
      if(!roomId) return new Error('No room has light: ' + lightId)
      return Floor.getFloorAndRoomByRoomId(device.roomId)
      .then(result=>{
        let floorName = result.floorName;
        let roomName = result.roomName;
        let roomFilter = roomIndexArr.filter(room=>{
          return room.roomId == roomId.toString();
        }).pop();
        if(!!roomFilter){
          let index = roomFilter.index;
          rooms[index].devices.push(light);
        } else {
          roomIndexArr.push({roomId: roomId, index: index});
          rooms.push({roomId: roomId, roomName: roomName, floorName:floorName, devices: [light]});
          index++;
        };
        if(++i===listOfLights.length) return Promise.resolve(rooms);
        return forLoop(i)
      })
    })
  }
  return forLoop(0);
}

module.exports.getLightIdByDeviceId = (deviceId, portId) =>{
  return LightingControl.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('Device not found')
    let lights = device.lights;
    let light = lights.filter(light=>{
      return light.portId == portId
    }).pop()
    return Promise.resolve(light._id)
  })
}
