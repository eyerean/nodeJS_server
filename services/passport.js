const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify username & password
  // call done with the user if it is correct
  // otherwise call done with false

  User.findOne({ email: email}, (err, user) => {
    if (err) {return done(err)};
    if(!user){
      return done(null, false);
    }
    //compare passwords
    user.comparePassword(password, (err, isMatch) => {
      if (err) {return done(err)};
      if(!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  })

});

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
passport.use(localLogin);
