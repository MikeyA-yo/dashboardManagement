const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Please provide room number"],
  },
  typeOfFood: {
    type: String,
    required: [true, "Please specify the type of food"],
  },
  beverageOrWater: {
    type: String,
    required: [true, "Please provide name of beverage or water"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Please provide name of payment method"],
    enum: ["Cash", "Card", "Transfer"],
  },
  serviceLocation: {
    type: String,
    required: [true, "Please provide name of service location"],
    enum: ["Room", "Restaurant"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide amount"],
    min: [0, "You can't pay a negative value"],
  },
  date:{
    type:String,
    default: new Date().toLocaleDateString()
  },
  username:{
    type:String
  },
  isPrint:{
    type:Boolean,
  }
});

module.exports = mongoose.model("Food", FoodSchema);
