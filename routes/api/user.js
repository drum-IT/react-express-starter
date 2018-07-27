// GET DEPENDENCIES
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

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

module.exports = userRouter;
