const mongoose = require("mongoose");

const DrinkSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: [true, "Please provide room number"],
  },
  drinkTypes: {
    type: Array,
    required: [true, "Please provide the guest's type of drink"],
  },
  drinkAmounts: {
    type: Array,
    required: [true, "Please provide the guest's type of beverage"],
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Transfer"],
    required: [true, "Please provide payment method"],
  },
  serviceLocation: {
    type: String,
    enum: ["Room Service", "Bar", "Room"],
    required: [true, "Please provide service location"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide the total amount being paid"],
    min: [0, "Total amount cannot be negative"],
  },
  dateOfEntry:{
    type: String,
    default: new Date().toLocaleDateString()
  },
  isPrint:{
    type:Boolean,
  }
});

module.exports = mongoose.model("Drink", DrinkSchema);
