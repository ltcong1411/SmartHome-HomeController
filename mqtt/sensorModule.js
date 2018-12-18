const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const io = require('../socket-io/SocketIO');

const SensorModule = require('../mongodb/home-model/sensorModule');
const Rules = require('../mongodb/home-model/rules');

client.on('connect',  () => {
  client.subscribe('devices/sensorModule/+');
  client.subscribe('lwt/sensorModule');
})

client.on('message', (topic, message) => {
    // console.log("log from sensor module")
    console.log("\r\n[" + topic + "]");
    deviceId = topic.split("/")[2];
    let promise = new Promise((resolve, reject)=>{
      resolve(JSON.parse(message))
    })
    promise.then(module=>{
      // console.log('//////////////')
      // console.log(module.deviceCode)
      return SensorModule.updateSensorValue(deviceId, module)
    })
    .then(module=>{
      for(let sensor of module.sensors){
        console.log(sensor)
        io.sockets.emit('device-event', sensor);
        Rules.checkOperations(sensor)
        .then(result=>{
          console.log(result)
        })
      }
    })
    .catch(err=> {
      console.log(err);
    })
});

module.exports = client;
