/* eslint prefer-destructuring: 0 */ // ESLINT WILL COMPLAIN ABOUT THE IMPORTS WITHOUT THIS
/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES

// GET DEPENDENCIES
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

// GET USER MODEL
const User = mongoose.model("users");

// CONFIGURE OPTIONS
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWTsecret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
