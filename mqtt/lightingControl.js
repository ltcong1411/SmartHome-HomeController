const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const LightingControl = require('../mongodb/home-model/lightingControl');
const Rules = require('../mongodb/home-model/rules');

client.on('connect',  () => {
  client.subscribe('devices/lighting-control/+/+');
  client.subscribe('lwt/lightingControl');
})

client.on('message', (topic, message) => {
    // console.log("log from lightingcontrol")
    console.log(topic + ": " + message);
    let arr = topic.split('/')
    let deviceId = arr[2]
    let portId = arr[3]
    let value = parseInt(message.toString())
    LightingControl.getLightIdByDeviceId(deviceId, portId)
    .then(lightId=>{
      let message = {
        _id: lightId,
        value: value
      }

      if (portId == 1){
      LightingControl.findAndUpdateLight(lightId, value)
    };

      console.log(message)
      io.sockets.emit('device-event', message)
      return Promise.resolve(message);
    })
    .then(light=>{
      return Rules.checkOperations(light);
    })
    .then(result=>{
      // console.log(result)
    })
    .catch(err=>{
      console.log(err)
    })
});

module.exports = client
const io = require('../socket-io/SocketIO');
