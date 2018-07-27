/* eslint no-console: 0 */
// GET DEPENDENCIES
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");

// GET ROUTERS
const userRouter = require("./routes/api/user");

// CONFIGURE EXPRESS SERVER
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// LOAD DEV ENV VARIABLES AND LOGGING
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  app.use(morgan("dev"));
}

// CONNECT TO MONGODB
const database = process.env.MONGODB_URI;
mongoose
  .connect(
    database,
    { useNewUrlParser: true }
  )
  .then(() => console.log("The server is now connected to MongoDB."))
  .catch(err => console.log(err));

// CONFIGURE PASSPORT
app.use(passport.initialize());
require("./config/passport")(passport);

// CONFIGIURE API ROUTES
app.use("/api/user", userRouter);

// @route  GET api/test
// @desc   Test the API
// @access Public
app.get("/api/test", (req, res) => {
  res.json({ message: "The server is working." });
});

// SERVE REACT FILES
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`The server is now listening on port ${PORT}.`);
