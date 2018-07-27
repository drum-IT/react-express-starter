const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/test", (req, res) => {
  const rando = Math.floor((Math.random() + 1) * 1000000);
  res.json(`The server is working! ${rando}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
