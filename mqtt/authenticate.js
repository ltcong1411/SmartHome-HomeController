const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const LightingControl = require('../mongodb/home-model/lightingControl');
const SensorModule = require('../mongodb/home-model/sensorModule');


client.on('connect',  () => {
  client.subscribe('authenticate');
})

client.on('message', (topic, message) => {
    // console.log("log from authenticate")
    console.log("[" + topic + "]" + message);
    let promise = new Promise((resolve, reject)=>{
      resolve(JSON.parse(message))
    })
    promise.then(device=>{
      switch(device.deviceType){
        case 'LightingControl':
            return LightingControl.authenticateDevices(device)
        case 'SensorModule':
            return SensorModule.authenticateDevices(device)
        
      }
    })
    .then(device=>{
      console.log(device)
      console.log('authenticate/' + device.deviceCode, device._id.toString());
      client.publish('authenticate/' + device.deviceCode, device._id.toString());
    })
    .catch(err=>{
      console.log(err)
    })
});

module.exports = client;
