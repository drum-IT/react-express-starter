// GET DEPENDENCIES
/* eslint prefer-destructuring: 0 */ // ESLINT WILL COMPLAIN ABOUT THE IMPORTS WITHOUT THIS
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

// GET USER MODEL
const User = mongoose.model("users");

// CONFIGURE OPTIONS
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

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
