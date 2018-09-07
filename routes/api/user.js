/* eslint no-console: 0 */ // PREVENT ESLINT FROM YELLING ABOUT SERVER CONSOLE MESSAGES

// GET DEPENDENCIES
const bcrypt = require("bcrypt");
const express = require("express");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// GET MAILER MODULE. USED TO SEND REGISTRATION AND VERIFICATION EMAILS.
const Mailer = require("../../util/mailer");
const userMaker = require("../../util/usermaker");

// GET VALIDATORS
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateForgotInput = require("../../validation/forgot");
const validateResetInput = require("../../validation/reset");

// CREATE EXPRESS ROUTER
const userRouter = express.Router();

// GET THE USER MODEL
const User = require("../../models/User");

// FOR SENDING ACCOUNT VERIFICATION EMAIL
function sendVerifyEmail(email, host) {
  const verificationToken = jwt.sign({ email }, process.env.JWTsecret, {});
  Mailer.sendEmail("verify", email, host, verificationToken);
}

// CONFIGURE ROUTES

// @route  POST api/user/register
// @desc   Register a new user account
// @access Public
userRouter.post("/register", (req, res) => {
  const { inputErrors, isValid } = validateRegisterInput(req.body);
  const appErrors = [];
  const appMessages = [];
  const appOutput = { appErrors, appMessages };
  if (!isValid) {
    return res.status(400).json(inputErrors);
  }
  return User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  }).then(users => {
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].username === req.body.username) {
        inputErrors.username = "That username is already in use.";
      }
      if (users[i].email === req.body.email) {
        inputErrors.email = "That email address is already in use.";
      }
    }
    if (inputErrors.username || inputErrors.email) {
      return res.status(400).json(inputErrors);
    }
    const avatar = gravatar.url(
      req.body.email,
      { s: "500", r: "pg", d: "retro" },
      true
    );
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      usernameL: req.body.username.toLowerCase(),
      avatar
    });
    return bcrypt.genSalt(10, (genErr, salt) => {
      if (genErr) throw genErr;
      bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
        if (hashErr) throw hashErr;
        newUser.password = hash;
        if (req.body.code === process.env.ADMIN_CODE) {
          newUser.isAdmin = true;
          newUser.verified = true;
        }
        newUser
          .save()
          .then(savedUser => {
            const { email } = req.body;
            const host =
              process.env.NODE_ENV === "production"
                ? req.headers.host
                : req.headers["x-forwarded-host"];
            sendVerifyEmail(email, host);
            appMessages.push("Registration complete. Please check your email.");
            res.json({
              appOutput
            });
          })
          .catch(err => console.log(err));
      });
    });
  });
});

// @route  GET api/user/verify
// @desc   Verify a user account
// @access Public
userRouter.get("/verify/:token/:email", (req, res) => {
  const { token, email } = req.params;
  const appErrors = [];
  const appMessages = [];
  const appOutput = { appErrors, appMessages };
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
      { email, verified: false },
      { verified: true },
      (updateErr, updatedUser) => {
        if (updateErr) {
          return res.status(400).json(updateErr);
        }
        if (!updatedUser) {
          appErrors.push("Verification link invalid.");
          return res.status(404).json({ appOutput });
        }
        const host =
          process.env.NODE_ENV === "production"
            ? req.headers.host
            : req.headers["x-forwarded-host"];
        Mailer.sendEmail("verified", updatedUser.email, host);
        appMessages.push(`${updatedUser.email} is now verified.`);
        return res.json({ appOutput });
      }
    );
  });
});

// @route  POST api/user/login
// @desc   Login a user and return JWT token
// @access Public
userRouter.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  const appErrors = [];
  const appMessages = [];
  const appOutput = { appErrors, appMessages };
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
      const host =
        process.env.NODE_ENV === "production"
          ? req.headers.host
          : req.headers["x-forwarded-host"];
      sendVerifyEmail(user.email, host);
      appErrors.push(
        "You must verify your account before signing in. Please check your email."
      );
      return res.status(400).json({ appOutput });
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

// @route  POST api/user/forgot
// @desc   Trigger password reset
// @access Public
userRouter.post("/forgot", (req, res) => {
  const { errors, isValid } = validateForgotInput(req.body);
  const appErrors = [];
  const appMessages = [];
  const appOutput = { appErrors, appMessages };
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email } = req.body;
  const resetToken = jwt.sign({ email }, process.env.JWTsecret, {});
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
      const host =
        process.env.NODE_ENV === "production"
          ? req.headers.host
          : req.headers["x-forwarded-host"];
      Mailer.sendEmail("reset", updatedUser.email, host, resetToken);
      appMessages.push(`Please check your email.`);
      return res.json({ appOutput });
    }
  );
});

// @route  POST api/user/reset/token/email
// @desc   Reset password
// @access Public
userRouter.post("/reset/:token/:email", (req, res) => {
  const { errors, isValid } = validateResetInput(req.body);
  const appErrors = [];
  const appMessages = [];
  const appOutput = { appErrors, appMessages };
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { token, email } = req.params;
  return jwt.verify(token, process.env.JWTsecret, err => {
    if (err) {
      appErrors.push("Failed to authenticate token");
      return res.status(500).json({ appOutput });
    }
    return User.findOne({ email, resetToken: token }, (findErr, foundUser) => {
      if (findErr) {
        appErrors.push("There was an error.");
        return res.status(404).json({ appOutput });
      }
      if (!foundUser) {
        appErrors.push("Reset link is not valid. Please try again.");
        return res.status(404).json({ appOutput, invalid: true });
      }
      if (foundUser.resetTime <= Date.now()) {
        appErrors.push("Reset link has expired.");
        return res.json({ appOutput, invalid: true });
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
                appErrors.push("Could not find user.");
                return res.status(404).json({ appOutput });
              }
              appMessages.push(
                "Password has been updated. You are now signed in."
              );
              const host =
                process.env.NODE_ENV === "production"
                  ? req.headers.host
                  : req.headers["x-forwarded-host"];
              Mailer.sendEmail("resetSuccess", updatedUser.email, host);
              const payload = {
                id: updatedUser.id,
                username: updatedUser.username
              };
              return jwt.sign(
                payload,
                process.env.JWTsecret,
                { expiresIn: 3600 },
                (signErr, updatedToken) => {
                  res.json({
                    success: true,
                    token: `Bearer ${updatedToken}`,
                    appOutput
                  });
                }
              );
            }
          );
        });
      });
    });
  });
});

// @route  GET api/user/current
// @desc   Get profile for the currently logged in user
// @access Private
userRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.headers);
    User.findById(
      req.user.id,
      "username email avatar isAdmin",
      (err, foundUser) => {
        if (err) {
          return res.json(err);
        }
        return res.json(foundUser);
      }
    );
  }
);

// @route  GET api/user/all/:page
// @desc   Get all profiles
// @access Private
userRouter.get(
  "/all/:page",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const { page } = req.params;
    User.findById(req.user.id, (userErr, foundUser) => {
      if (userErr || !foundUser.isAdmin) {
        errors.admin = "Error while verifying admin rights.";
        return res.json(errors);
      }
      return User.find(
        // { _id: { $ne: req.user.id } },
        {},
        "username avatar created",
        { skip: (page - 1) * 10, limit: 100, sort: { usernameL: "asc" } },
        (usersErr, foundUsers) => {
          if (usersErr) {
            errors.users = "There was an error finding the users";
            return res.json(errors);
          }
          return User.countDocuments(
            { _id: { $ne: req.user.id } },
            (err, count) => res.json({ foundUsers, count })
          );
        }
      );
    });
  }
);

// @route  GET api/user/admin/:page
// @desc   Get all profiles
// @access Private
userRouter.get(
  "/admin/:page",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const { page } = req.params;
    User.findById(req.user.id, (userErr, foundUser) => {
      if (userErr || !foundUser.isAdmin) {
        errors.admin = "Error while verifying admin rights.";
        return res.json(errors);
      }
      return User.find(
        { _id: { $ne: req.user.id } },
        "username email avatar isAdmin verified created",
        { skip: (page - 1) * 10, limit: 100, sort: { username: "asc" } },
        (usersErr, foundUsers) => {
          if (usersErr) {
            errors.users = "There was an error finding the users";
            return res.json(errors);
          }
          return User.countDocuments(
            { _id: { $ne: req.user.id } },
            (err, count) => res.json({ foundUsers, count })
          );
        }
      );
    });
  }
);

userRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const appErrors = [];
    const appMessages = [];
    const appOutput = { appErrors, appMessages };
    User.findByIdAndRemove(req.user.id, (err, deletedUser) => {
      console.log(deletedUser);
      if (err) {
        return res.json(err);
      }
      Mailer.sendEmail("deleteSuccess", deletedUser.email);
      appMessages.push("Account deleted.");
      return res.json({ appOutput });
    });
  }
);

userRouter.post(
  "/generate",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = [];
    const newUsers = [];
    if (req.user.isAdmin) {
      userMaker.users.forEach(user => {
        User.find({
          $or: [{ email: user.email }, { username: user.username }]
        }).then(users => {
          for (let i = 0; i < users.length; i += 1) {
            if (users[i].username === user.username) {
              errors.push(`${user.username} is already in use.`);
            }
            if (users[i].email === user.email) {
              errors.push(`${user.email} is already in use.`);
            }
          }
          if (errors.length > 0) {
            return;
          }
          const avatar = gravatar.url(
            user.email,
            { s: "500", r: "pg", d: "retro" },
            true
          );
          const newUser = new User({
            email: user.email,
            password: "password",
            username: user.username,
            usernameL: user.username.toLowerCase(),
            avatar
          });
          bcrypt.genSalt(10, (genErr, salt) => {
            if (genErr) throw genErr;
            bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
              if (hashErr) throw hashErr;
              newUser.password = hash;
              newUser
                .save()
                .then(savedUser => {
                  newUsers.push(savedUser);
                })
                .catch(err => console.log(err));
            });
          });
        });
      });
      res.json({ errors, newUsers });
    }
  }
);

module.exports = userRouter;
