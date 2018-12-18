const io = require('socket.io-client');
var socket = io('http://localhost:4000');

module.exports = socket;
