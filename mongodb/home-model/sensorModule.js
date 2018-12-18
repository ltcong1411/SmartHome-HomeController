var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var Schema = mongoose.Schema;

var SensorModuleSchema = new Schema({
    deviceCode: String,         // Ex: 'ss123'
    deviceType: String,         // 'SensorModule'
    numberOfSensors: Number,    // Ex: '1 ss', '4 ss', ...
    allowToConnect: Boolean,
    battery: Number,      // Ex: '60%', '80%'
    roomId: Schema.Types.ObjectId,
    sensors: [
      {
          name: String,         // Ex: 'Light sensor 1', 'Light sensor 2', 'Temperature sensor 2',...
          _type: String,         // Ex: 'Light sensor', 'Temperature sensor',...
          value: Number
      }
    ]
}, {collection: "devices", versionKey: false});

const SensorModule = module.exports = mongoose.model('SensorModule', SensorModuleSchema);

module.exports.updateSensorName = function(deviceId, sensors){
  return SensorModule.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('SensorModule not found: ' + deviceId)
    for(i=0; i< device.sensors.length; i++){
      device.sensors[i].name = sensors[i].name;
      if((i+1)===device.sensors.length){
        return device.save()
      }
    }
  })
  .then(device=>{
    return Promise.resolve('sensors have been updated')
  })
}

module.exports.updateSensorValue = function(deviceId, sensorModule){
  return SensorModule.findById(deviceId)
  .then(device=>{
    if(!device) throw new Error('SensorModule not found: ' + deviceId)
    device.battery = sensorModule.battery;
    for(i=0; i< device.sensors.length; i++){
      device.sensors[i].value = sensorModule.sensors[i].value;
      if((i+1)===device.sensors.length){
        return device.save()
      }
    }
  })
}

module.exports.updateSensors = function(deviceId, sensorModule){
  return SensorModule.findByIdAndUpdate(deviceId, sensorModule)
  .then(device=>{
    return Promise.resolve('SensorModule has been updated')
  })
}


module.exports.authenticateDevices = function(data) {
  return SensorModule.findOne({deviceCode: data.deviceCode})
  .then(device=>{
    if(!!device) return Promise.resolve(device)
    let newDevice = new SensorModule(data);
    return newDevice.save().then(device=>{
      return Promise.resolve(device)
    })
  })
};

module.exports.getSensorDetails = function(sensorId){
  return SensorModule.findOne({"sensors._id": sensorId})
  .then(device=>{
    if(!device) throw new Error('No SensorModule has sensor: ' + sensorId)
    let sensor = device.sensors.id(sensorId);
    return Promise.resolve(sensor)
  })
}
