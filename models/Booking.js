const mongoose = require("mongoose");

const { Schema } = mongoose;

const BookingSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms"
  },
  guest: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  }
});

const Booking = mongoose.model("bookings", BookingSchema);

module.exports = Booking;
