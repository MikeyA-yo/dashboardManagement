const mongoose = require("mongoose");

function connectdb(url) {
  mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));
}

module.exports = connectdb;
