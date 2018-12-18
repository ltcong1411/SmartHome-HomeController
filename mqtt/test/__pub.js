var mqtt = require('mqtt');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client = mqtt.createClient(1883, 'localhost');

client.subscribe('presence');

rl.on('line', (line) => {
  client.publish('test',line);
});

//client.end();
