const mongoose = require("mongoose");

// Define Room schema
const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  no: { type: String, required: true },
  price: { type: String, required: true },
  mainPhoto: String,
  photo1: String,
  photo2: String,
  photo3: String,
  status: { type: String, default: "Available" },
});

const RoomModel = mongoose.model("Room", roomSchema);
module.exports = RoomModel;
