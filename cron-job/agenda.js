const Agenda = require('agenda');

var mongoConnectionString = "mongodb://localhost:27017/agenda";
var agenda = new Agenda({db: {address: mongoConnectionString}});

module.exports = agenda;
