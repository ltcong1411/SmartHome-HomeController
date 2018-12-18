const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const QRcode = require('../../mongodb/user-model/qrcode');

const Rules = require('../../mongodb/home-model/rules');

client.on('connect',  () => {
    client.subscribe('QrCheck');
  })

client.on('message', (topic, message) => {
    // console.log("log from authenticate")
    console.log("[" + topic + "]" + message);
    QRcode.getListOfQRcodes()
      .then(QrUsers => {
            
            for (let i = 0; i < QrUsers.length; i++){
            let QrUser = QrUsers[i];
            if (message == QrUser.content){
              let user = {_id: QrUser.userId};
              Rules.checkOperations(user)
              } else {
                console.log('fffffffffffffffffffffffalse')
            }
        } 
         
    })
    .catch(err=>{
      console.log(err)
    })
});

module.exports = client;