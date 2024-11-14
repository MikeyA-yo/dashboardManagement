const Booking = require("../models/Booking");
const Drinks = require("../models/Drinks");
const User = require("../models/User");
const {io} = require("../../app")
const registerUser = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const user = await User.create({ name, username, password, role:"Admin" });
    const token = user.createJWT();
    res.status(201).cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
    }).json({username: user.username})
    // localStorage.setItem("token", token);

    // res.status(201).json({ username: user.username });
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
    // res.cookie("token", token);

    res.status(200).cookie("token", token,  {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge:7 * 24 * 60 * 60 * 1000 // 7 day
    }).json({user})
  } catch (err) {
    res.status(500).json({ message: "Login Failed", error: err.message });
  }
};

// Deleting all the users in the database
const deleteAllUsers = async (req, res) => {
  try {
    await User.find().deleteMany({});
    io.on("connection", socket =>{
      io.emit("log-out")
    })
    res.status(200).json({ message: "Deleted all users and their data's successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete all users" });
  }
};
const checkUser=async (req, res)=>{
  const {username} = req.body;
  const user = await User.findOne({username});
  return res.json(user)
}
const logOut = async (req, res) =>{
  try{
   res.status(200).clearCookie('token').json({ message: 'Logged out successfully' });
  }catch(e){
   res.status(500).json({message: "Logout error"})
  }
}

module.exports = { registerUser, logIn, deleteAllUsers, logOut, checkUser };
