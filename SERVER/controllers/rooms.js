const mongoose = require("mongoose");
const RoomModel = require("../models/Room");

// Add a new room with image uploads
const addRoom = async (req, res) => {
  const { type, no, price } = req.body;

  // Create new RoomModel instance with uploaded file paths
  const roomData = new RoomModel({
    type,
    no,
    price,
    mainPhoto: req.files && req.files["mainPhoto"] ? `/uploads/${req.files["mainPhoto"][0].filename}` : 'uploads/default-room.jpg',
    photo1: req.files && req.files["photo1"] ? `/uploads/${req.files["photo1"][0].filename}` : null,
    photo2: req.files && req.files["photo2"] ? `/uploads/${req.files["photo2"][0].filename}` : null,
    photo3: req.files && req.files["photo3"] ? `/uploads/${req.files["photo3"][0].filename}` : null,
    
  });
  

  try {
    await roomData.save();
    res.status(201).json({ message: "Room added successfully", room: roomData });
  } catch (error) {
    res.status(400).json({ message: "Error saving room", error: error.message });
  }
};

// Fetch all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find({});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

// Fetch a specific room by ID
const getRoom = async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};

// Update room information, including uploaded images
const updateRoom = async (req, res) => {
  const roomId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: "Invalid room ID" });
  }

  const updatedRoomData = {
    type: req.body.type,
    no: req.body.no,
    price: req.body.price,
    status: req.body.status,
    mainPhoto: req.files && req.files["mainPhoto"] ? `/uploads/${req.files["mainPhoto"][0].filename}` : undefined,
    photo1: req.files && req.files["photo1"] ? `/uploads/${req.files["photo1"][0].filename}` : undefined,
    photo2: req.files && req.files["photo2"] ? `/uploads/${req.files["photo2"][0].filename}` : undefined,
    photo3: req.files && req.files["photo3"] ? `/uploads/${req.files["photo3"][0].filename}` : undefined,
  };

  try {
    const updatedRoom = await RoomModel.findByIdAndUpdate(roomId, updatedRoomData, { new: true });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Failed to update room", error: error.message });
  }
};


module.exports = { addRoom, getAllRooms, getRoom, updateRoom };
