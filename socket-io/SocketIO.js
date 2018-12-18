const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const LightingControl = require('../mongodb/home-model/lightingControl');
const Rules = require('../mongodb/home-model/rules');
const AccessControl = require('../mongodb/home-model/accessControl');

// const ltctrlMQTT = require('../mqtt/lightingControl');
// const fingerPrintClient = require('../mqtt/access-control/fingerprint');

const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://localhost:1883');

function VBColorToHEX(value){
  if(!value) return "#000000"
  return '#' + value.toString(16)
}

io.on('connection', (socket) => {
  console.log('Socket.IO: user connected');

  socket.on('disconnect', function(){
    console.log('Socket.IO: user disconnected');
  });

  socket.on('test', message=>{
    console.log("---------------------------------")
    console.log(message);
  })

  // socket.on('sensor-event', message=>{
  //   console.log('---socket------sensor-event-------')
  //   console.log(message);
  //   socket.broadcast.emit('device-event', message);
  // })

  socket.on('security-event', message=>{
    socket.broadcast.emit('security-event', message)
  })

  socket.on('device-event', (light) => {
    console.log(light);
    socket.broadcast.emit(light._id, light);
    socket.broadcast.emit('device-event', light);
    LightingControl.findAndUpdateLight(light._id, light.value)
    .then(device=>{
      let value = light.value
      if(device.typeOfLight=='Bulb'){
        value = Math.round(Math.acos(Math.sqrt(value/100))/(Math.PI*50)*1000000);
        value = value < 1000 ? 1000 : value;
      }
      if(device.typeOfLight=='RGB'){
        value = VBColorToHEX(value);
      }
      mqttClient.publish('devices/' + device.deviceId, device.portId.toString() + value);
      // ltctrlMQTT.send(result, light.value)
      console.log('dayne' + value);
      return Promise.resolve(true);
    })
    .then(()=>{
      return Rules.checkOperations(light);
    })
    .then(result=>{
      // console.log(result);
    })
    .catch(err=>{
      console.log(err);
    })
  });

  socket.on('access-control/fingerprint', message=>{
    let command = message.command;
    let user = message.user
    console.log(message)
    switch(command){
      case 'authenticate':
        mqttClient.publish('fgss1/' + command, 'authenticate');
        break;
      case 'enrol':
        mqttClient.publish('fgss1/' + command, user);
        break;
      case 'deleteFingerprints':
        AccessControl.getListOfFingerprints(user)
        .then(fingerprints=>{
          mqttClient.publish('fgss1/deleteFingerprints', fingerprints.toString())
          return Promise.resolve()
        })
        .then(()=>{
          return AccessControl.deleteFingerprints(user)
        })
        .catch(err=>{
          console.log(err)
        })
        break;
    }
  })

  socket.on('access-control/face-recognition', message=>{
    let command = message.command;
    let user = message.user
    // console.log(message)
    // console.log(user)
    switch(command){
      case 'authenticate':
        mqttClient.publish('face-recognition-01/' + command, 'authenticate');
        break;
      case 'enrol':
        mqttClient.publish('face-recognition-01/' + command, user.toString());
        break;
    }
  })

  socket.on('mobile-action-event', message=>{
    switch(message.typeOfMobileAction){
      case 'CALL':
        mqttClient.publish('sim900/call', message.phoneNumber)
        break;
      case 'SEND SMS':
        mqttClient.publish('sim900/send-sms', message.phoneNumber+ '/' +message.message)
        break;
    }
  })
});


// Port Number
const port = 4000;

// Start Server
http.listen(port, () => {
  console.log('Socket started on port '+ port);
});

module.exports = io;
