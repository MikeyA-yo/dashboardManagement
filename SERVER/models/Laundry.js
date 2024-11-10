const mongoose = require("mongoose");

const LaundrySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide full name"],
  },
  roomNumber: {
    type: String,
    required: [true, "Please provide room number"],
  },
  numberOfClothes: {
    type: Number,
    required: [true, "Please provide the number of clothes"],
    min: [0, "Value cannot be negative"],
  },
  typeOfService: {
    type: String,
    required: [true, "Please provide the type of service"],
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Transfer"],
    required: [true, "Please provide payment method"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide the amount being paid"],
  },
  date:{
    type:String,
    default: new Date().toLocaleDateString()
  },
  username:{
    type:String
  }
});

module.exports = mongoose.model("Laundry", LaundrySchema);
