const mongoose = require("mongoose");
const RoomModel = require("../models/Room");

const addRoom = async (req, res) => {
  const { type, no, price } = req.body;

  // Added type checks to check if the req.files actually exists

  const roomData = new RoomModel({
    type,
    no,
    price,
    mainPhoto:
      req.files && req.files["mainPhoto"]
        ? `/uploads/${req?.files["mainPhoto"][0].filename}`
        : null,
    photo1:
      req.files && req.files["photo1"]
        ? `/uploads/${req?.files["photo1"][0].filename}`
        : null,
    photo2:
      req.files && req.files["photo2"]
        ? `/uploads/${req?.files["photo2"][0].filename}`
        : null,
    photo3:
      req.files && req.files["photo3"]
        ? `/uploads/${req?.files["photo3"][0].filename}`
        : null,
  });

  try {
    await roomData.save();
    res.status(201).send("Room added successfully");
  } catch (error) {
    res.status(400).send("Error saving room: " + error.message);
  }
};
 
const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).send("Error fetching rooms: " + error.message);
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch room", error: error.message });
  }
};

const updateRoom = async (req, res) => {
  const roomId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  try {
    const updatedRoomData = {
      type: req.body.type,
      no: req.body.no,
      price: req.body.price,
      mainPhoto:
        req.files && req.files["mainPhoto"]
          ? `/uploads/${req.files["mainPhoto"][0].filename}`
          : undefined,
      photo1:
        req.files && req.files["photo1"]
          ? `/uploads/${req.files["photo1"][0].filename}`
          : undefined,
      photo2:
        req.files && req.files["photo2"]
          ? `/uploads/${req.files["photo2"][0].filename}`
          : undefined,
      photo3:
        req.files && req.files["photo3"]
          ? `/uploads/${req.files["photo3"][0].filename}`
          : undefined,
      status:req.body.status    
    };

    const updatedRoom = await RoomModel.updateOne({_id:roomId}, updatedRoomData)
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res
      .status(200)
      .json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update room", error: error.message });
  }
};

module.exports = { addRoom, getAllRooms, getRoom, updateRoom };
