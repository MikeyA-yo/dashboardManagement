const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide name of guest"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide guest phone number"],
    match: [/^\d{10,13}$/, "Please enter a valid 10-13 digit phone number"],
  },
  durationOfStayStart: {
    type: Date,
    required: [true, "Add stay duration"],
  },
  durationOfStayEnd: {
    type: Date,
    required: [true, "Add stay duration"],
  },
  roomNumber: {
    type: Number,
    required: [true, "Provide room number"],
  },
  roomPrice: {
    type: Number,
    required: [true, "Provide room price"],
  },
  roomType: {
    type: String,
    required: [true, "Provide room type"],
  },
  numberOfDays:{
   type: Number,
   default:0
  },
  totalAmount:{
    type:Number,
    default: 0
  },
  completedDate:{
    type: String,
    default: new Date().toISOString()
  },
  username:{
    type:String,
    required: [true, "Provide username"]
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isPrint:{
    type:Boolean,
  }
});

BookingSchema.pre("save", function (next) {
  if (typeof this.durationOfStayStart === "string") {
    const date = new Date(this.durationOfStayStart);
    if (isNaN(date.getTime())) {
      return next(new Error("Invalid date format"));
    }
    this.durationOfStayStart = date;
  }
  next();
});

BookingSchema.pre("save", function (next) {
  if (typeof this.durationOfStayEnd === "string") {
    const date = new Date(this.durationOfStayEnd);
    if (isNaN(date.getTime())) {
      return next(new Error("Invalid date format"));
    }
    this.durationOfStayEnd = date;
  }
  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
