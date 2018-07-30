/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES

// GET DEPENDENCIES
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// GET MAILER MODULE. USED TO SEND REGISTRATION AND VERIFICATION EMAILS.
const Mailer = require("../../util/mailer");

function sendVerifyEmail(email) {
  const verificationToken = jwt.sign({ email }, process.env.JWTsecret, {});
  Mailer.sendTestRegistrationEmail(email, verificationToken);
}

// GET VALIDATORS
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// CREATE EXPRESS ROUTER
const userRouter = express.Router();

// GET THE USER MODEL
const User = require("../../models/User");

// CONFIGURE ROUTES

// @route  GET api/user/test
// @desc   Test user route
// @access Public
userRouter.get("/test", (req, res) =>
  res.json({ message: "User route test success!" })
);

// @route  POST api/user/register
// @desc   Register a new user account
// @access Public
userRouter.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  return User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  }).then(users => {
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].email === req.body.email) {
        errors.email = "That email address is already in use.";
        return res.status(400).json(errors);
      }
      if (users[i].username === req.body.username) {
        errors.username = "That username is already in use.";
        return res.status(400).json(errors);
      }
    }
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    });
    return bcrypt.genSalt(10, (genErr, salt) => {
      if (genErr) throw genErr;
      bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
        if (hashErr) throw hashErr;
        newUser.password = hash;
        newUser
          .save()
          .then(savedUser => {
            sendVerifyEmail(savedUser.email);
            res.json(savedUser);
          })
          .catch(err => console.log(err));
      });
    });
  });
});

// @route  POST api/user/verify
// @desc   Verify a user account
// @access Public
userRouter.get("/verify/:token/:email", (req, res) => {
  const { token, email } = req.params;
  if (!token) {
    return res.status(400).json({ message: "Error. No token provided." });
  }
  if (!email) {
    return res.status(400).json({ message: "Error. No email provided." });
  }
  return jwt.verify(token, process.env.JWTsecret, err => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }
    return User.findOneAndUpdate(
      { email },
      { verified: true },
      (updateErr, updatedUser) => {
        if (updateErr) {
          return res.status(400).json(updateErr);
        }
        return res.json({ message: `${updatedUser.email} verified.` });
      }
    );
  });
});

// @route  POST api/user/login
// @desc   Login a user and return JWT token
// @access Public
userRouter.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password } = req.body;
  return User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "Email address or password incorrect.";
      return res.status(400).json(errors);
    }
    if (!user.verified) {
      sendVerifyEmail(user.email);
      errors.email =
        "You must verify your account before logging in. Please check your email.";
      return res.status(400).json(errors);
    }
    return bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username
        };
        return jwt.sign(
          payload,
          process.env.JWTsecret,
          { expiresIn: 3600 },
          (err, token) => res.json({ success: true, token: `Bearer ${token}` })
        );
      }
      errors.email = "Email address or password incorrect.";
      return res.status(400).json(errors);
    });
  });
});

// @route  POST api/user/current
// @desc   Get the currently logged in user
// @access Private
userRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email
    });
  }
);

module.exports = userRouter;
