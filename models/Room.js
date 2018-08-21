const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

const Room = mongoose.model("rooms", RoomSchema);

module.exports = Room;
