const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../mongodb/user-model/user');
const config = require('../config/database');

const Floor = require('../mongodb/home-model/floor');

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  passport.use('getUserById', new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload._doc._id)
    User.getUserById(jwt_payload._doc._id, (err, user) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));


  passport.use('gethouse', new JwtStrategy(opts, (jwt_payload, done) => {
    House.getHouse((err, house) => {
      if(err){
        return done(err, false);
      }
      if(house){
        return done(null, house);
      } else {
        return done(null, false);
      }
    });
  }));

  passport.use('getListOfFloors', new JwtStrategy(opts, (jwt_payload, done) => {
    Floor.getListOfFloors((err, floor) => {
      if(err){
        return done(err, false);
      }
      if(floor){
        return done(null, floor);
      } else {
        return done(null, false);
      }
    });
  }));

  passport.use('authenticate', new JwtStrategy(opts, (jwt_payload, done) => {
    return done(null, {});
  }));
}
