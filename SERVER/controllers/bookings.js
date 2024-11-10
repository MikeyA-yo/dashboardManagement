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
    // const hasMissingField = requiredFields.some((field) => !req.body[field]);

    // if (hasMissingField) {
    //   //\To check for missing fields
    //   return res
    //     .status(400)
    //     .json({ message: "Please fill all necessary fields" });
    // }
    let {
      fullName,
      phoneNumber,
      durationOfStayStart,
      durationOfStayEnd,
      roomNumber,
      roomPrice,
      roomType,
      numberOfDays,
      totalAmount,
      username,
      isConfirmed,
      edit,
      _id
    } = req.body;
    if (
      !fullName ||
      !phoneNumber ||
      !durationOfStayStart ||
      !durationOfStayEnd ||
      !roomNumber ||
      !roomPrice ||
      !roomType
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all necessary fields" });
    }
    let bk
    if (!edit){
      const booking = new Booking({
        fullName,
        phoneNumber,
        durationOfStayStart,
        durationOfStayEnd,
        roomNumber,
        roomPrice,
        roomType,
        numberOfDays,
        totalAmount,
        username,
        isConfirmed,
      });
      booking.save();
      bk = booking
    }else{
      bk = await Booking.updateOne({_id}, {fullName,
        phoneNumber,
        durationOfStayStart,
        durationOfStayEnd,
        roomNumber,
        roomPrice,
        roomType,
        numberOfDays,
        totalAmount,
        username,
        isConfirmed})

    }
    res.status(201).json({ message: "Booking successfully added", bk });
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
const deleteBookings = async (req, res) => {
  const { username, roomNumber, completed } = req.body;
  try {
    const bookings =  Booking.find();
    
    if (username && roomNumber){
      await bookings.deleteMany({username, roomNumber})
    } else if (completed){
      await bookings.deleteMany({ isConfirmed:false})
    }else{
      await bookings.deleteMany({})
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to delete bookings", error: err.message });
  }
};
module.exports = { addBooking, seeBookings, deleteBookings };
