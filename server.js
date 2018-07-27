const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/test", (req, res) => {
  res.json("The server is working!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Server now listening on port ${PORT}`);
