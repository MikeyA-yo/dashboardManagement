const mongoose = require("mongoose");

const Pool = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide full name"],
  },
  hours: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: [true, "Please provide the swimming duration"],
  },
  hotelAccessories: {
    type: String,
  }, 
  totalCost: {
    type: Number,
    min: [0, "Amount cannot be negative"],
    required: [true, "Please provide the total cost for the swimming session"],
  },
  date:{
    type: String,
    default: new Date().toLocaleDateString()
  },
  username:{
    type:String
  }
});

module.exports = mongoose.model("Pool", Pool);
