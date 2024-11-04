const Booking = require("../models/Booking");

// Adding a new booking
const addBooking = async (req, res) => {
  try {
    const requiredFields = [
      "fullName",
      "durationOfStayStart",
      "durationOfStayEnd",
      "roomNumber",
      "roomPrice",
      "roomType",
      "phoneNumber",
    ];

    const hasMissingField = requiredFields.some((field) => !req.body[field]);

    if (hasMissingField) {
      //\To check for missing fields
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }

    const booking = await Booking.create({ ...req.body });
    res.status(201).json({ message: "Booking successfully added", booking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add booking", error: err.message });
  }
};

const seeBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: err.message });
  }
};

module.exports = { addBooking, seeBookings };
