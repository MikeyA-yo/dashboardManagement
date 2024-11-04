const mongoose = require("mongoose");

const DrinkSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Please provide room number"],
  },
  drinkType: {
    type: String,
    required: [true, "Please provide the guest's type of drink"],
  },
  beverageType: {
    type: String,
    required: [true, "Please provide the guest's type of beverage"],
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Transfer"],
    required: [true, "Please provide payment method"],
  },
  serviceLocation: {
    type: String,
    enum: ["Room Service", "Bar"],
    required: [true, "Please provide service location"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide the total amount being paid"],
    min: [0, "Total amount cannot be negative"],
  },
});

module.exports = mongoose.model("Drink", DrinkSchema);
