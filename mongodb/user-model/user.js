const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  name: String,
  email: {type: String, required: true, unique: true},
  username: {type: String,required: true, unique: true},
  password: {type: String,required: true}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
