const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide full name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide guest's phone number"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  eventType: {
    type: String,
    required: [true, "Please provide the name of the type of event"],
  },
  eventDate: {
    type: Date,
    required: [true, "Please provide start date of event"],
  },
  renderedServices: {
    type: String,
    required: [true, "List the services you wish to render the guest"],
  },
  totalCost: {
    type: Number,
    min: [0, "Negative values not allowed"],
    required: [true, "Please provide the total amount for the cost of events"],
  },
});

// To convert date in you form (e.g 2024-11-11) to a mongodb's format, i.e ISOString
EventSchema.pre("save", function (next) {
  if (typeof this.durationOfStayStart === "string") {
    const date = new Date(this.durationOfStayStart);
    if (isNaN(date.getTime())) {
      return next(new Error("Invalid date format"));
    }
    this.durationOfStayStart = date;
  }
  next();
});

module.exports = mongoose.model("Event", EventSchema);
