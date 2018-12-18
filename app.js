const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const agenda = require('./cron-job/agenda');
const cronJobsOfScenes = require('./cron-job/scenes');
const mqtt = require('./mqtt/mqtt');
const socketIO = require('./socket-io/SocketIO');


// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+ config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');
const house = require('./routes/house');
const devices = require('./routes/devices');
const scenes = require('./routes/scenes');
const rules = require('./routes/rules');
const accessControl = require('./routes/access-control');


// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/house', house);
app.use('/devices', devices);
app.use('/scenes', scenes)
app.use('/rules', rules);
app.use('/access-control', accessControl);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

app.on('error', (err)=>{
  console.log(err);
})
// Start Server
app.listen(port, () => {
  console.log('Server started on port ' + port);
});

agenda.on('ready', function() {
  console.log('agenda is ready!')
  agenda.start();
  cronJobsOfScenes.restartCronJobs();
});
