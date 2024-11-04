const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Creating the user schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: [true, "This user already exists"], //Each username should be unique to prevent clashing during logins
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    default: "User",
    enum: ["User", "Admin"],
  },
});

// Instance method to create JWT on the model directly
UserSchema.methods.createJWT = function () {
  // Sign the jwt using the secret in the .env file along with userId and username as the payload
  const token = jwt.sign(
    { userId: this._id, username: this.username, userRole: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // returns the token which you would use in logins and registrations
  return token;
};

// Encrypt the password before saving to the database using the pre save middleware;
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

// Using the bcrypt module to compare the passwords with the one in the database;
UserSchema.methods.comparePassword = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
