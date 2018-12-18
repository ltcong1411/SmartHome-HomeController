const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const io = require('../../socket-io/SocketIO');

const AccessControl = require('../../mongodb/home-model/accessControl');
const Rules = require('../../mongodb/home-model/rules');

client.on('connect',  () => {
  client.subscribe('access-control/fingerprint/#');
  client.subscribe('lwt/access-control/fingerprint');
  client.publish('fgss1/authenticate', '');
})

client.on('message', (topic, message) => {
  // console.log("log from fingerprint")
  console.log("[" + topic + "]\n\r" + message);
  let promise = new Promise((resolve,reject)=>{
    switch(topic){
      case 'access-control/fingerprint/enrol/message':
        io.sockets.emit('access-control/fingerprint/enrol/message', message.toString());
        return resolve(true);
      case 'access-control/fingerprint/enrol/complete':
        let json = JSON.parse(message);
        let userId = json.userId;
        let fingerprintId = json.fingerprintId;
        console.log(userId);
        console.log(fingerprintId);
        return resolve(AccessControl.updateFingerprintId(userId, fingerprintId))
      case 'access-control/fingerprint/authenticate/found-id':
        let id = message.toString();
        return AccessControl.getUserFromFingerprint(id)
        .then(user=>{
          resolve(Rules.checkOperations(user));
        })
    }
  })
  promise.catch(err=>{
    console.log(err)
  })

});

module.exports = client;
