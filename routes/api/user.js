/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES

// GET DEPENDENCIES
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// GET MAILER MODULE. USED TO SEND REGISTRATION AND VERIFICATION EMAILS.
const Mailer = require("../../util/mailer");

// GET VALIDATORS
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotInput = require("../../validation/forgot");
const validateResetInput = require("../../validation/reset");

// CREATE EXPRESS ROUTER
const userRouter = express.Router();

// GET THE USER MODEL
const User = require("../../models/User");

function sendVerifyEmail(email, host) {
  const verificationToken = jwt.sign({ email }, process.env.JWTsecret, {});
  Mailer.sendEmail("verify", email, host, verificationToken);
}

// CONFIGURE ROUTES

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
      if (users[i].username === req.body.username) {
        errors.username = "That username is already in use.";
      }
      if (users[i].email === req.body.email) {
        errors.email = "That email address is already in use.";
      }
    }
    if (errors.username || errors.email) {
      return res.status(400).json(errors);
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
        console.log(req.body.code, process.env.ADMIN_CODE);
        if (req.body.code === process.env.ADMIN_CODE) {
          newUser.isAdmin = true;
        }
        newUser
          .save()
          .then(savedUser => {
            const { email } = req.body;
            sendVerifyEmail(email, req.headers["x-forwarded-host"]);
            res.json(savedUser);
          })
          .catch(err => console.log(err));
      });
    });
  });
});

// @route  POST api/user/forgot
// @desc   Trigger password reset
// @access Public
userRouter.post("/forgot", (req, res) => {
  const { errors, isValid } = validateForgotInput(req.body);
  const messages = {};
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email } = req.body;
  const resetToken =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  const resetTime = Date.now() + 3600000;
  return User.findOneAndUpdate(
    { email },
    { resetToken, resetTime },
    { new: true },
    (updateErr, updatedUser) => {
      if (updateErr) {
        return res.status(400).json(updateErr);
      }
      if (!updatedUser) {
        errors.email = "Email address not found.";
        return res.status(404).json(errors);
      }
      Mailer.sendEmail(
        "reset",
        updatedUser.email,
        req.headers["x-forwarded-host"],
        resetToken
      );
      messages.email = "Please check your email.";
      return res.json(messages);
    }
  );
});

// @route  POST api/user/reset/token/email
// @desc   Reset password
// @access Public
userRouter.post("/reset/:token/:email", (req, res) => {
  const { errors, isValid } = validateResetInput(req.body);
  const messages = {};
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { token, email } = req.params;
  return User.findOne({ email, resetToken: token }, (err, foundUser) => {
    if (!foundUser) {
      errors.formError = "Reset link is not valid.";
      return res.status(404).json(errors);
    }
    if (foundUser.resetTime <= Date.now()) {
      errors.formError = "Reset link has expired.";
      return res.json(errors);
    }
    const { password } = req.body;
    return bcrypt.genSalt(10, (genErr, salt) => {
      if (genErr) throw genErr;
      bcrypt.hash(password, salt, (hashErr, hash) => {
        if (hashErr) throw hashErr;
        User.findByIdAndUpdate(
          foundUser.id,
          { password: hash, resetToken: "", resetTime: Date.now() },
          (updateErr, updatedUser) => {
            if (updateErr) {
              return res.json(updateErr);
            }
            if (!updatedUser) {
              return res.status(404).json({ error: "could not find user" });
            }
            messages.formMessage = "Password has been updated.";
            return res.json(messages);
          }
        );
      });
    });
  });
});

// @route  GET api/user/verify
// @desc   Verify a user account
// @access Public
userRouter.get("/verify/:token/:email", (req, res) => {
  const { token, email } = req.params;
  const messages = {};
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
        Mailer.sendEmail("verified", updatedUser.email, req.headers.host);
        messages.formMessage = "Account verified!";
        return res.json(messages);
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
      errors.email = "No account found with that email address.";
      return res.status(404).json(errors);
    }
    if (!user.verified) {
      sendVerifyEmail(user.email, req.headers["x-forwarded-host"]);
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
          (err, token) => {
            res.json({ success: true, token: `Bearer ${token}` });
          }
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
