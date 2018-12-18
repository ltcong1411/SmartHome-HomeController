const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

const DevicesSchema = new Schema({
    deviceCode: String,         // Ex: 'ltctrl12c5'
    deviceType: String,         // Ex: 'LightingControl', 'SensorModule'
    allowToConnect: Boolean,
    roomId: Schema.Types.ObjectId
}, {versionKey: false});

const Devices = module.exports = mongoose.model('devices', DevicesSchema);
const Floors = require('./floor');

module.exports.getDevice = function(deviceId){
  return Devices.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('device not found: ' + id)
    return Promise.resolve(device)
  })
}

module.exports.authenticateDevices = function(newDevice) {
  return Devices.findOne({deviceCode: newDevice.deviceCode})
  .then(device=>{
    if(!device){
      return newDevice.save()
      .then(()=>{return Promise.resolve('new device detected')})
    }
    if(device.allowToConnect) return Promise.resolve('device is allowed to connect')
    return Promise.resolve('device is not allowed to connect')
  })
};

module.exports.getListOfDevices = function(){
  return Devices.find()
}

module.exports.updateRoomId = function(deviceId, roomId){
  return Devices.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('device not found: ' + deviceId);
    device.roomId = roomId;
    return device.save()
  })
  .then(device=>{
    return Promise.resolve('roomId has been updated to device')
  })
}

module.exports.updatePermission = function(deviceId, permission){
  return Devices.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('device not found')
    device.allowToConnect = permission;
    return device.save()
  })
  .then(device=>{
    return Promise.resolve('device has been updated')
  })
}

module.exports.getListOfDevicesInRoom = function(roomId){
  return Devices.find({'roomId': roomId})
  .then(devices=>{
    if(!devices.length) return Promise.resolve('No device has roomId: ' + roomId)
    return Promise.resolve(devices)
  })
}

module.exports.deleteDevice = function (id) {
  return Devices.findByIdAndRemove(id);
}

// module.exports.getListOfDevicesInHouse = function(callback){
//   return Floors.getListOfFloors()
//   .then(listOfFloors=>{
//
//   })
//   Floors.getListOfFloors(result=>{
//     if(result.success){
//       let listOfFloors = result.floors;
//       for(let i=0; i<listOfFloors.length; i++){
//         let rooms = listOfFloors[i].rooms;
//         for(let j=0; j<rooms.length; j++){
//           let roomId = rooms[j]._id;
//           Devices.getListOfDevicesInRoom(roomId, result=>{
//             if(result.success){
//               let devices = result.devices;
//               listOfFloors[i].rooms[j].devices = devices;
//               if(((i+1)*(j+1))==((listOfFloors.length)*(rooms.length))){
//                 callback({success: true, listOfDevices: listOfFloors});
//               }
//             }
//           })
//         }
//       }
//     }
//   })
// }
