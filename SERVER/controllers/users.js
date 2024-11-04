const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const user = await User.create({ name, username, password });
    const token = user.createJWT();
    localStorage.setItem("token", token);

    res.status(201).json({ username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
};

const logIn = async (req, res) => {
  const { username, password } = req.body;

  // find the user
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const user = await User.findOne({ username: username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: `User with the username ${username} does not exist...`,
      });
    }

    // Compare encrypted password
    const matched = user.comparePassword(password);

    // check if the password matches
    if (!matched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // If all user passes both checks then send the token
    const token = user.createJWT();
    localStorage.setItem("token", token);

    res.status(200).json({ username });
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};

// Deleting all the users in the database
const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "Deleted all users successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete all users" });
  }
};

module.exports = { registerUser, logIn, deleteAllUsers };
