const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), 
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // see if the user ID in the payload exists in our db
  // if yes, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, (err, user) => {
    if(err) { return done(err, false); }

    if(user){
      done(null, user);
    } else {
      //no error, but no authenticated user either
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
